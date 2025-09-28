using System;
using System.Threading;
using System.Threading.Tasks;
using MCMS.Core.Abstractions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace MCMS.Infrastructure.Integrations;

public class EspritAutomationService : IEspritAutomationService
{
    private readonly ILogger<EspritAutomationService> _logger;
    private readonly EspritAutomationOptions _options;

    public EspritAutomationService(
        ILogger<EspritAutomationService> logger,
        IOptions<EspritAutomationOptions> options)
    {
        _logger = logger;
        _options = options.Value ?? new EspritAutomationOptions();
    }

    public Task TriggerProgramGenerationAsync(Guid routingId, CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        SignalApplyEvent(routingId);

        if (_options.WaitForReadySignal)
        {
            WaitForReadySignal(routingId, cancellationToken);
        }

        return Task.CompletedTask;
    }

    public Task<bool> IsAvailableAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (!TryOpenExisting(_options.EspritReadyEventName, out var readyHandle))
        {
            return Task.FromResult(false);
        }

        using (readyHandle)
        {
            var signalled = readyHandle.WaitOne(TimeSpan.Zero);
            if (!signalled)
            {
                _logger.LogDebug(
                    "Esprit ready event {EventName} exists but is not signalled yet.",
                    _options.EspritReadyEventName);
            }

            return Task.FromResult(true);
        }
    }

    private void SignalApplyEvent(Guid routingId)
    {
        using var applyHandle = new EventWaitHandle(
            false,
            EventResetMode.ManualReset,
            _options.ApplyEventName,
            out var created);

        if (created)
        {
            _logger.LogWarning(
                "Apply event {EventName} was created on demand; ensure automation host is running.",
                _options.ApplyEventName);
        }

        _logger.LogInformation(
            "Signalling Esprit Apply completion for routing {RoutingId} via event {EventName}.",
            routingId,
            _options.ApplyEventName);

        if (!applyHandle.Set())
        {
            _logger.LogWarning(
                "Apply event {EventName} did not report success when set; it may already be signalled.",
                _options.ApplyEventName);
        }
    }

    private void WaitForReadySignal(Guid routingId, CancellationToken cancellationToken)
    {
        using var readyHandle = new EventWaitHandle(
            false,
            EventResetMode.ManualReset,
            _options.EspritReadyEventName,
            out var created);

        if (created)
        {
            _logger.LogWarning(
                "Esprit ready event {EventName} was created on demand; readiness may not be emitted yet.",
                _options.EspritReadyEventName);
        }

        var waitHandles = new WaitHandle[] { readyHandle, cancellationToken.WaitHandle };
        var timeout = TimeSpan.FromSeconds(Math.Max(1, _options.ReadyWaitTimeoutSeconds));

        _logger.LogInformation(
            "Waiting up to {TimeoutSeconds} seconds for Esprit ready event {EventName} (RoutingId={RoutingId}).",
            timeout.TotalSeconds,
            _options.EspritReadyEventName,
            routingId);

        var waitResult = WaitHandle.WaitAny(waitHandles, timeout);

        if (waitResult == WaitHandle.WaitTimeout)
        {
            throw new TimeoutException(
                $"Timed out waiting for Esprit ready event '{_options.EspritReadyEventName}' after {timeout.TotalSeconds} seconds.");
        }

        if (waitResult == 1)
        {
            cancellationToken.ThrowIfCancellationRequested();
        }

        _logger.LogInformation(
            "Received Esprit ready signal {EventName} for routing {RoutingId}.",
            _options.EspritReadyEventName,
            routingId);

        if (_options.ResetReadyEventAfterSignal)
        {
            readyHandle.Reset();
            _logger.LogDebug(
                "Reset ready event {EventName} after consumption.",
                _options.EspritReadyEventName);
        }

        if (_options.ResetApplyEventAfterSignal)
        {
            ResetApplyEvent();
        }
    }

    private void ResetApplyEvent()
    {
        if (!TryOpenExisting(_options.ApplyEventName, out var applyHandle))
        {
            return;
        }

        using (applyHandle)
        {
            applyHandle.Reset();
            _logger.LogDebug(
                "Reset apply event {EventName} after ready signal.",
                _options.ApplyEventName);
        }
    }

    private static bool TryOpenExisting(string name, out EventWaitHandle? handle)
    {
        try
        {
            handle = EventWaitHandle.OpenExisting(name);
            return true;
        }
        catch (WaitHandleCannotBeOpenedException)
        {
            handle = null;
            return false;
        }
    }
}

using System;
using System.Diagnostics.Tracing;
using System.Threading;

namespace MCMS.Infrastructure.FileStorage;

[EventSource(Name = "MCMS.FileStorage")]
internal sealed class FileStorageEventSource : EventSource
{
    public static readonly FileStorageEventSource Log = new();

    private readonly PollingCounter _queueLength;
    private readonly EventCounter _writeDuration;
    private readonly EventCounter _queueWait;
    private readonly IncrementingPollingCounter _writeRate;

    private long _queueLengthValue;
    private long _totalWrites;

    private FileStorageEventSource()
    {
        _queueLength = new PollingCounter("meta-json-queue-length", this, () => Volatile.Read(ref _queueLengthValue))
        {
            DisplayName = "Meta JSON queue length"
        };

        _writeDuration = new EventCounter("meta-json-write-duration-ms", this)
        {
            DisplayName = "Meta JSON write duration (ms)"
        };

        _queueWait = new EventCounter("meta-json-queue-wait-ms", this)
        {
            DisplayName = "Meta JSON queue wait (ms)"
        };

        _writeRate = new IncrementingPollingCounter("meta-json-writes-total", this, () => Interlocked.Read(ref _totalWrites))
        {
            DisplayName = "Meta JSON writes",
            DisplayRateTimeScale = TimeSpan.FromSeconds(60)
        };
    }

    public void ReportQueueLength(int length)
    {
        if (length < 0)
        {
            length = 0;
        }

        Volatile.Write(ref _queueLengthValue, length);
    }

    public void RecordWrite(double milliseconds)
    {
        _writeDuration.WriteMetric(milliseconds);
        Interlocked.Increment(ref _totalWrites);
    }

    public void RecordQueueWait(double milliseconds)
    {
        _queueWait.WriteMetric(milliseconds);
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            _queueLength.Dispose();
            _writeDuration.Dispose();
            _queueWait.Dispose();
            _writeRate.Dispose();
        }

        base.Dispose(disposing);
    }
}

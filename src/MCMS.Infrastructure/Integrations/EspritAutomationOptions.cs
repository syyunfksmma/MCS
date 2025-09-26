namespace MCMS.Infrastructure.Integrations;

public class EspritAutomationOptions
{
    public string ApplyEventName { get; set; } = "Global\\MCS.Apply.Completed";
    public string EspritReadyEventName { get; set; } = "Global\\MCS.Esprit.Ready";
    public bool WaitForReadySignal { get; set; } = true;
    public int ReadyWaitTimeoutSeconds { get; set; } = 900;
    public bool ResetReadyEventAfterSignal { get; set; } = true;
    public bool ResetApplyEventAfterSignal { get; set; } = true;
}

namespace MCMS.Infrastructure.Integrations;

public class ErpOptions
{
    public string ConnectionString { get; set; } = string.Empty;
    public string WorkOrderViewName { get; set; } = "BI_OPERATION_VIEW";
}

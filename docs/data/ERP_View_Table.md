# ERP View Table Specification — 2025-09-29

## Purpose
Define Materialized ERP view `vwERP_RoutingDashboard` consumed by `/api/products/dashboard`.

## Columns
| Column | Source | Description |
| --- | --- | --- |
| `Item_CD` | ERP `ItemMaster.ItemCode` | Product code displayed in Explorer. |
| `Item_Name` | ERP `ItemMaster.Description` | Human readable name. |
| `Res_CD` | ERP `Resource.ResourceCode` | Assigned resource group. |
| `Routing_Count` | ERP `RoutingHeader` | Number of routings per revision. |
| `SolidWorks_Path` | ERP `Document.Link` | UNC path to 3DM files. |
| `Last_Updated` | ERP `RoutingHeader.LastModified` | Timestamp for dashboard ordering. |
| `RowVersion` | ERP `RoutingHeader.RowVersion` | Used for concurrency sync. |

## View Definition
```sql
CREATE OR ALTER VIEW dbo.vwERP_RoutingDashboard AS
SELECT
    im.ItemCode    AS Item_CD,
    im.Description AS Item_Name,
    r.ResourceCode AS Res_CD,
    COUNT(rh.RoutingId) AS Routing_Count,
    sw.DocumentPath AS SolidWorks_Path,
    MAX(rh.LastModifiedUtc) AS Last_Updated,
    MAX(rh.RowVersion) AS RowVersion
FROM ERP.ItemMaster im
JOIN ERP.RoutingHeader rh ON rh.ItemId = im.ItemId
LEFT JOIN ERP.Resource r ON r.ResourceId = rh.ResourceId
LEFT JOIN ERP.DocumentLink sw ON sw.ItemId = im.ItemId AND sw.DocumentType = '3DM'
GROUP BY im.ItemCode, im.Description, r.ResourceCode, sw.DocumentPath;
```

## Refresh Cadence
- Materialized via SQL Agent job `MCMS_DashboardRefresh` every 15 minutes.
- Job script stored at `scripts/db/Refresh-ERPView.sql`.

## Validation
- View row count must equal product table count (difference < 1%).
- Spot check sample item GT-3100 matches SolidWorks path `\\MCMS_SHARE\Routing\GT-3100\3DM\GT-3100.3dm`.

> 작성: 2025-09-29 Codex

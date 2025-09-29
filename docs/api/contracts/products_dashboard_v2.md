# /api/products/dashboard Contract v2

## Request
- Method: GET
- Query params:
  - `page` (default 1)
  - `size` (default 20, max 100)
  - `sort` (code|name|updatedAt)
  - `filter[solidWorks]` (present|missing|unknown)

## Response
```
{
  "page": 1,
  "size": 20,
  "total": 124,
  "items": [
    {
      "id": "p1",
      "code": "ITEM-100",
      "name": "Turning Assembly",
      "latestRevision": "REV02",
      "routingGroupCount": 2,
      "routingCount": 5,
      "solidWorksStatus": "present",
      "solidWorksPath": "\\\\MCMS_SHARE\\models\\ITEM-100\\REV02\\assembly.sldasm",
      "owner": "cam.lead",
      "updatedAt": "2025-09-28T05:00:00Z"
    }
  ]
}
```

## Authorization
- Scope: `MCMS.Routing.Read`
- Roles: Viewer+, Editor, Approver, Admin

## Notes
- Pagination uses offset/limit semantics. Combine with React Query key `['products-dashboard', params]`.

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | v2 contract documenting fields & paging |

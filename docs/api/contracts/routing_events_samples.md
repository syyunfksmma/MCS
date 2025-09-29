# Routing Group / Version / Event Response Samples

## GET /api/routings/{id}
```
{
  "id": "routing_gt310001",
  "itemId": "item_a",
  "revisionId": "item_a_rev01",
  "groupId": "group_a_machining",
  "code": "GT310001",
  "status": "Approved",
  "camRevision": "1.2.0",
  "owner": "cam.jane",
  "sharedDrivePath": "\\\\MCMS_SHARE\\Routing\\Item_A\\REV_item_a_rev01\\GROUP_group_a_machining",
  "files": [
    { "id": "file1", "name": "program.esp", "type": "esprit" },
    { "id": "file2", "name": "ncfile.nc", "type": "nc" }
  ],
  "events": [
    {
      "id": "evt-approve-1",
      "type": "routing.approved",
      "actor": "qa.bot",
      "createdAt": "2025-09-28T05:05:00Z",
      "comment": "Auto-approved after QA review"
    }
  ]
}
```

## POST /api/routings/{id}/events (Apply→Ready)
```
{
  "eventId": "evt-ready-2",
  "routingId": "routing_gt310001",
  "event": "routing.ready",
  "submittedAt": "2025-09-29T02:10:00Z",
  "actor": "ops.user",
  "metadata": {
    "packagePath": "\\\\MCMS_SHARE\\packages\\Item_A\\20250929.zip",
    "hash": "e3b0c44298fc1c149afbf4c8996fb924"
  }
}
```

## Version Listing
```
{
  "routingId": "routing_gt310001",
  "versions": [
    { "version": "1.2.0", "status": "Approved", "createdAt": "2025-09-28T05:00:00Z" },
    { "version": "1.1.0", "status": "Archived", "createdAt": "2025-09-20T03:00:00Z" }
  ]
}
```

Revision History
| Date | Author | Notes |
| --- | --- | --- |
| 2025-09-29 | Codex | Initial samples for API/Design sync |

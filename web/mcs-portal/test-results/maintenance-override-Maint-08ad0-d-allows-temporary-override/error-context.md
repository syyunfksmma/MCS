# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - img "exclamation-circle" [ref=e6]:
      - img [ref=e7]
    - generic [ref=e9]: Scheduled maintenance in progress
    - generic [ref=e10]: Sep 25, 10:00 AM GMT+9 → Sep 25, 12:00 PM GMT+9
    - generic [ref=e12]:
      - button "Temporary override" [ref=e14] [cursor=pointer]:
        - generic [ref=e15] [cursor=pointer]: Temporary override
      - link "Contact operations" [ref=e17] [cursor=pointer]:
        - /url: mailto:ops-bridge@example.com
        - generic [ref=e18] [cursor=pointer]: Contact operations
    - generic [ref=e19]:
      - generic [ref=e20]: Scheduled maintenance window. Admin console will be read-only.
      - alert [ref=e21]:
        - img "exclamation-circle" [ref=e22]:
          - img [ref=e23]
        - generic [ref=e26]: Only proceed with override if you are performing validation.
```
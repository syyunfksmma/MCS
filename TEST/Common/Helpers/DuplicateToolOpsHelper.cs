using CAM_API.Common;
using CAM_API.Common.DTO;
using Esprit;
using EspritTechnology;
using EspritTools;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CAM_API.Common.Helpers
{
    public static class DuplicateToolOpsHelper
    {
        // ToolID -> ToolNumber 맵
        public static Dictionary<string, int> BuildToolIdToNumberMap(Tools tools)
        {
            var map = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            if (tools == null) return map;

            foreach (ITechnology t in tools)
            {
                var idObj = t.FindParameter("ToolID")?.Value;
                var numObj = t.FindParameter("ToolNumber")?.Value;
                if (idObj == null || numObj == null) continue;

                var id = idObj.ToString();
                if (string.IsNullOrWhiteSpace(id)) continue;

                int num;
                if (!int.TryParse(numObj.ToString(), out num)) continue;
                map[id] = num; // 동일 ID가 여러 번 나오면 마지막값으로 덮기
            }
            return map;
        }

        // 모든 공정 수집
        public static List<OperationToolInfo> GatherAll(Document doc)
        {
            var list = new List<OperationToolInfo>();
            if (doc == null) return list;

            var partOps = doc.PartOperations;
            var tools = doc.Tools as Tools;
            var idToNo = BuildToolIdToNumberMap(tools);

            int i = 1; // 보통 1-based
            foreach (PartOperation op in partOps)
            {
                var tech = op.Technology as ITechnology;
                var toolId = tech?.FindParameter("ToolID")?.Value?.ToString();
                idToNo.TryGetValue(toolId ?? "", out var toolNo);

                list.Add(new OperationToolInfo
                {
                    Index = i,
                    OperationName = op.Name,
                    ToolId = toolId,
                    ToolNumber = toolNo,
                    Operation = op
                });
                i++;
            }
            return list;
        }

        // 중복 툴번호(>1개)만 펼쳐서 반환
        public static List<OperationToolInfo> FindDuplicates(IEnumerable<OperationToolInfo> all)
        {
            return all
                .Where(x => x.ToolNumber > 0 && !string.IsNullOrWhiteSpace(x.ToolId)) // 이름 없는 건 제외
                .GroupBy(x => x.ToolNumber)
                // 같은 번호 그룹 안에서 ToolID가 2개 이상(서로 다름)일 때만
                .Where(g => g.Select(x => x.ToolId)
                             .Distinct(StringComparer.OrdinalIgnoreCase)
                             .Count() > 1)
                .SelectMany(g => g.OrderBy(x => x.Index))
                .ToList();
        }

        // 선택 삭제(인덱스 역순)
        public static void RemoveSelected(Document doc, IEnumerable<OperationToolInfo> selected)
        {
            var partOps = doc?.PartOperations;
            if (partOps == null) return;

            var toRemove = selected
                .Select(s => s.Index)
                .Distinct()
                .OrderByDescending(x => x);

            foreach (var idx in toRemove)
                partOps.Remove(idx);
        }
    }
}

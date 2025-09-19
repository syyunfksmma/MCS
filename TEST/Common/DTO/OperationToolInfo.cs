using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Esprit;

namespace CAM_API.Common.DTO
{
    public sealed class OperationToolInfo
    {
        public int Index { get; set; }                 // PartOperations 인덱스(보통 1-based)
        public string OperationName { get; set; }
        public string ToolId { get; set; }
        public int ToolNumber { get; set; }
        public PartOperation Operation { get; set; }
        public bool IsSelected { get; set; }           // 창에서 체크박스 바인딩
    }
}

using System;
using System.IO;

namespace MCMS.Core.Contracts.Requests;

public record UploadRoutingFileRequest(
    Guid RoutingId,
    Stream Content,
    string FileName,
    string FileType,
    bool IsPrimary,
    string UploadedBy);

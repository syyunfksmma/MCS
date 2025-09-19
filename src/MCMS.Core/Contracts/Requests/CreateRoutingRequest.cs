using MCMS.Core.Contracts.Dtos;

namespace MCMS.Core.Contracts.Requests;

public record CreateRoutingRequest(
    Guid ItemRevisionId,
    string RoutingCode,
    bool IsPrimary,
    IEnumerable<RoutingStepWriteModel> Steps,
    IEnumerable<RoutingFileWriteModel> Files,
    string RequestedBy);

public record RoutingStepWriteModel(
    int Sequence,
    string Machine,
    string ProcessDescription,
    string? ToolInformation,
    string? Notes);

public record RoutingFileWriteModel(
    string FileName,
    string RelativePath,
    long FileSizeBytes,
    string Checksum,
    string FileType,
    bool IsPrimary);

using System.IO;

namespace MCMS.Core.Contracts.Dtos;

public record RoutingBundleStream(Stream Stream, string FileName, string ContentType, string? Checksum);

public record RoutingFileStream(Stream Stream, string FileName, string ContentType, string? Checksum);

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY ./publish/api .
EXPOSE 5229
ENTRYPOINT ["dotnet", "MCMS.Api.dll"]

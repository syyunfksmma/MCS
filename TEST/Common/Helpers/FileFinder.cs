using System;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Forms;

namespace CAM_API.Common.Helpers
{
    /// <summary>
    /// Method that searches for a file in the specified directory and returns its full path.
    /// </summary>
    /// <param name="rootPath">Top-level directory where the search begins.</param>
    /// <param name="targetFileName">Name of the file to find (e.g., "e.txt").</param>
    /// <returns>Full path of the found file, or null if not found.</returns>

    internal class FileFinder
    {
        private readonly Esprit.Application _application;
        private readonly Esprit.Document Document;
        private readonly string rootPath1;
        private readonly string rootPath2;

        public FileFinder(Esprit.Application application)
        {
            _application = application;
            Document = _application.Document;
            rootPath1 = _application.Configuration.GetFileDirectory(EspritConstants.espFileType.espFileTypeMachineSetup);
            rootPath2 = _application.Configuration.GetFileDirectory(EspritConstants.espFileType.espFileTypeFixtures);
        }

        public string MFilePath(string targetFileName)
        {
            try
            {
                // 첫 번째 발견된 파일 경로 반환
                string mprj = Directory.EnumerateFiles(rootPath1, targetFileName, SearchOption.AllDirectories).FirstOrDefault();
                return mprj;
            }
            catch(UnauthorizedAccessException)
            {
                Console.WriteLine("경로에 접근할 권한이 없습니다.");
            }
            catch (DirectoryNotFoundException)
            {
                Console.WriteLine("저장된 디렉토리가 존재하지 않습니다.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"오류 발생 : {ex.Message}");
            }

            return null;
        }

        public string FFilePath(string targetFileName)
        {
            try
            {
                // 첫 번째 발견된 파일 경로 반환
                string gdml = Directory.EnumerateFiles(rootPath2, targetFileName, SearchOption.AllDirectories).FirstOrDefault();
                return gdml;
            }
            catch (UnauthorizedAccessException)
            {
                Console.WriteLine("경로에 접근할 권한이 없습니다.");
            }
            catch (DirectoryNotFoundException)
            {
                Console.WriteLine("저장된 디렉토리가 존재하지 않습니다.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"오류 발생 : {ex.Message}");
            }

            return null;
        }
    }
}

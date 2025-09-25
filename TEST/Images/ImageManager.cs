using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Reflection;

namespace CAM_API.Images
{
    internal class ImageManager : IDisposable
    {
        private readonly Dictionary<string, Icon> _icons = new Dictionary<string, Icon>();

        // 지정된 이름의 아이콘을 반환하는 속성
        public Icon GetIcon(string iconName)
        {
            if (_icons.ContainsKey(iconName))
            {
                return _icons[iconName];
            }

            try
            {
                // 현재 어셈블리에서 리소스 스트림을 가져와서 아이콘을 생성
                Assembly assembly = this.GetType().Assembly;
                string resourceName = assembly.GetName().Name + "." + "Images" + "." + iconName + ".ico";

                // 리소스를 스트림으로 읽기
                Stream iconStream = assembly.GetManifestResourceStream(resourceName);

                if (iconStream != null)
                {
                    // 아이콘을 메모리에 로드하고 캐시
                    Icon icon = new Icon(iconStream);
                    _icons[iconName] = icon; // 아이콘을 캐시에 저장
                    return icon;
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        // IDisposable 인터페이스 구현
        public void Dispose()
        {
            foreach (var icon in _icons.Values)
            {
                icon.Dispose();
            }
            _icons.Clear();
        }
    }
}

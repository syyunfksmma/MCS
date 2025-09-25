using Esprit;
using EspritComBase;

namespace CAM_API.Feature.Services
{
    /// <summary>
    /// Esprit COM 예외 (ComFaults)를 처리하는 유틸리티
    /// </summary>
    public static class ComFaultHandler
    {
        /// <summary>
        /// COM Faults 리스트를 메시지 창에 출력
        /// </summary>
        public static void Handle(ComFaults comFaults, string context, Application app)
        {
            if (comFaults == null || comFaults.Count == 0)
                return;

            for (int i = 1; i <= comFaults.Count; i++)
            {
                var fault = comFaults[i];

                var severity = fault.Severity == espFaultSeverity.espFaultWarning
                    ? EspritConstants.espMessageType.espMessageTypeWarning
                    : EspritConstants.espMessageType.espMessageTypeError;

                app.EventWindow.AddMessage(severity, context, fault.Description);
            }
        }
    }
}

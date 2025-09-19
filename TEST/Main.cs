using ESPRIT.NetApi.Extensions;
using System;
using System.ComponentModel;
using System.ComponentModel.Composition;
using System.Windows.Markup;

// To debug Extension

// 1) In the properties in the build tab set the output folder to 

// C:\Users\Public\Documents\Hexagon\ESPRIT EDGE (current version of ESPRITEDGE)\Data\Extensions

// 2) In the debug tab set the "Start Action" -> "Start External Program" set the value to the ESPRITEDGE.exe path.  

// 3) In the debug tab set the "Start Options" -> "Working Directory" to the value to the folder of the ESPRITEDGE.exe.

// You can now start the project F5 and debug.

// 
// -------------------------------------------
// Project: CAM API
// File: Main.cs
// Description: Main entry point for the automation API
// Author: Tim (FKSM)
// Last Updated: 2025-06-30
// 
// ▶ Class operation flow is documented in /UML folder
// ▶ PlantUML was used; not always synced with latest code
// ▶ Temporary classes for function testing are marked with // function test
// ▶ Non-critical comments remain untranslated
// -------------------------------------------

namespace CAM_API
{
    [Export(typeof(IExtension))]
    [ExportMetadata("SupportBuild", 20)] //this must match the major build of ESPRIT EDGE you compile for
    public class Main : IExtension
    {
        public string Description => "FKSM API provides a powerful interface to integrate and automate manufacturing processes.It offers seamless communication between Esprit CAM software and machine tools, enabling advanced data processing, automation, and workflow optimization.";
        public string Name => "FKSM API_v0.1.1";
        public string Publisher => "tkyunkim@ksm.co.kr";
        public string Url => @"http://www.espritcam.com";

        internal static Esprit.Application _espritApplication = null;
        private AddinUi _addinUi;

        /// <summary></summary>
        public void Connect(object app)
        {
            try
            {
                _espritApplication = app as Esprit.Application;
                _addinUi = new AddinUi(_espritApplication);
            }
            catch (Exception ex)
            {
                System.Windows.Forms.MessageBox.Show(
                  $"[Connect] 예외 발생:\n{ex}",
                  "FKSM API 오류",
                  System.Windows.Forms.MessageBoxButtons.OK,
                  System.Windows.Forms.MessageBoxIcon.Error);
                throw;
            }
        }

        public void Disconnect()
        {
            _addinUi?.Dispose();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CAM_API.Common.Helpers
{
    internal class SelectionSetHelper
    {
        public static Esprit.SelectionSet GetSelectionSet(Esprit.Document document, string name)
        {
            var set = document.SelectionSets[name];
            if (set == null)
            {
                set = document.SelectionSets.Add(name);
            }
            return set;
        }
    }
}

//using System;
//using System.Collections.Generic;
//using System.Text.RegularExpressions;
//using Esprit;
//using EspritProperties;


//namespace CAM_API.Feature
//{
//    /// <summary>
//    /// Handles CAD feature properties.
//    /// Enables collecting SolidFaces by property name and value.
//    /// See CreateHoleFeatures.cs for Condition usage,
//    /// and CreatePocketFeature.cs for GetOrAddCustomProperty example.
//    /// </summary>

//    public class CustomPropConditions
//    {
//        public string PropName { get; set; }
//        public List<string> PropValues { get; set; }

//        public CustomPropConditions(string propertyName, List<string> propertyValue)
//        {
//            PropName = propertyName;
//            PropValues = propertyValue ?? new List<string>(); //null 값 처리
//        }

//        // 조건을 비교하는 메서드
//        public static bool IsMatchWithRegex(List<Tuple<string, string>> customprop, List<CustomPropConditions> conditions)
//        {
//            try
//            {
//                foreach (var con in conditions)
//                {
//                    bool conditionMet = false;

//                    for (int i = 0; i < customprop.Count; i++)
//                    {
//                        if (con.PropName == customprop[i].Item1)
//                        {
//                            foreach (string value in con.PropValues)
//                            {
//                                if (Regex.IsMatch(customprop[i].Item2, value))
//                                {
//                                    conditionMet = true;
//                                    break; // 이 조건은 만족했으므로 다음 조건으로
//                                }
//                            }
//                            if (conditionMet) break; // 조건이 만족되면 다음 customprop 확인할 필요 없음
//                        }
//                    }

//                    // 현재 조건이 만족되지 않으면 즉시 false 반환
//                    if (!conditionMet)
//                    {
//                        return false;
//                    }
//                }

//                // 모든 조건이 만족되었으면 true 반환
//                return true;
//            }
//            catch (ArgumentException ex)
//            {
//                // 정규 표현식이 잘못되었을 경우 예외 처리
//                Console.WriteLine($"Invalid Regex pattern: {ex.Message}");
//                return false;
//            }
//        }

//        static public EspritProperties.CustomProperty GetOrAddCustomProperty(CustomProperties customProperties, string name, EspritConstants.espPropertyType type)
//        {
//            EspritProperties.CustomProperty customProperty = customProperties[name];

//            if (customProperty != null && customProperty.VariableType != type)
//            {
//                customProperties.Remove(name);
//                customProperty = null;
//            }

//            if (customProperty == null)
//            {
//                var properties = customProperties;
//                customProperty = (type == EspritConstants.espPropertyType.espPropertyTypeString)
//                    ? properties.Add(name, name, type, "")
//                    : properties.Add(name, name, type, 0);
//            }

//            return customProperty;
//        }

//        //public void CADFeaturesInHOLES(Esprit.Document doc)
//        //{
//        //    //Feature에서 cadfeature 속성 트리 접근하는 코드
//        //    foreach (Esprit.IHolesFeature feature in doc.HolesFeatures)
//        //    {
//        //        try
//        //        {
//        //            var customProps = feature.CustomProperties as EspritProperties.CustomProperties;
//        //            var customProp = customProps.ItemByEnumeration(espReservedCustomPropertyType.cadFeature) as EspritProperties.CustomProperty;
//        //            var childProps = customProp as EspritProperties.CustomProperties;

//        //            if (childProps == null) return;
//        //            for (int j = 1; j <= childProps.Count; j++)
//        //            {
//        //                var sub = childProps[j];               // EspritProperties.CustomProperty
//        //                string caption = sub.Caption;         // 자식 항목의 레이블
//        //                object value = sub.Value;         // 자식 항목의 실제 값
//        //                System.Windows.Forms.MessageBox.Show($"caption : {caption} / value : {value}", "childProps",
//        //                System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Information);
//        //            }
//        //        }
//        //        catch (Exception ex)
//        //        {
//        //            System.Windows.Forms.MessageBox.Show($"작업 중 오류가 발생했습니다:\n{ex.Message}", "Error",
//        //           System.Windows.Forms.MessageBoxButtons.OK, System.Windows.Forms.MessageBoxIcon.Error);
//        //        }
//        //    }
//        //}
//    }
//}

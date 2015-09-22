package gw.xml.xsd.typeprovider

uses org.junit.Test

uses java.math.BigDecimal

/**
 * Created by carson on 9/22/15.
 */
class XmlSchemaSimpleValueValidationTest extends XSDTest {

  @Test
  function testValidationErrorCausesOriginalValueToRemainUnchanged() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()
    xml.FractionDigits2 = 42
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = 1234.567 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = 1234.567 } )
    assertEquals( 42 as BigDecimal, xml.FractionDigits2 )
    assertEquals( 42 as BigDecimal, xml.FractionDigits2_elem.$Value )
  }

}
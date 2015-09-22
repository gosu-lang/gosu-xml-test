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

  @Test
  function testFractionDigitsFacet() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = 1234.567 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = 1234.567 } )

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = -1234.567 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = -1234.567 } )

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = 0.001 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = 0.001 } )

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = 0.000 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = 0.000 } )

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = -0.000 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = -0.000 } )

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = 0.010 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = 0.010 } )

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = 0.0000000000000000000000000000000000000000000000000000000000000000001 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = 0.0000000000000000000000000000000000000000000000000000000000000000001 } )

    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2 = -1234563679037902375029752397223984723984723985238947239847298374982374982374982738.123 } )
    assertXmlSimpleValueException( \ ->{ xml.FractionDigits2_elem.$Value = -1234563679037902375029752397223984723984723985238947239847298374982374982374982738.123 } )

    xml.FractionDigits2 = 0.00
    xml.FractionDigits2_elem.$Value = 0.00

    xml.FractionDigits2 = -0.00
    xml.FractionDigits2_elem.$Value = -0.00

    xml.FractionDigits2 = -0.01
    xml.FractionDigits2_elem.$Value = -0.01

    xml.FractionDigits2 = 1234.56
    xml.FractionDigits2_elem.$Value = 1234.56

    xml.FractionDigits2 = 0.0
    xml.FractionDigits2_elem.$Value = 0.0

    xml.FractionDigits2 = 42
    xml.FractionDigits2_elem.$Value = 42
    assertTrue( xml.FractionDigits2.equals( new BigDecimal( "42" ) ) )
    assertFalse( xml.FractionDigits2.equals( 42 ) ) // assert current behavior

    xml.FractionDigits2 = -1234563679037902375029752397223984723984723985238947239847298374982374982374982738.12
    xml.FractionDigits2_elem.$Value = -1234563679037902375029752397223984723984723985238947239847298374982374982374982738.12

    xml.FractionDigits2 = -1234563679037902375029752397223984723984723985
    xml.FractionDigits2_elem.$Value = -1234563679037902375029752397223984723984723985

  }

  @Test
  function testMaxLengthFacetWithString() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MaxLengthString5 = "123456" } )
    assertXmlSimpleValueException( \ ->{ xml.MaxLengthString5_elem.$Value = "123456" } )

    assertXmlSimpleValueException( \ ->{ xml.MaxLengthString5 = "12345678901234567890" } )
    assertXmlSimpleValueException( \ ->{ xml.MaxLengthString5_elem.$Value = "12345678901234567890" } )

    xml.MaxLengthString5 = "12345"
    xml.MaxLengthString5 = "1234"
    xml.MaxLengthString5 = "1"
    xml.MaxLengthString5 = ""
  }

  @Test
  function testMaxLengthFacetWithHexBinary() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MaxLengthHexBinary5 = { 0, 0, 0, 0, 0, 0 } } )
    assertXmlSimpleValueException( \ ->{ xml.MaxLengthHexBinary5_elem.$Value = { 0, 0, 0, 0, 0, 0 } } )

    assertXmlSimpleValueException( \ ->{ xml.MaxLengthHexBinary5 = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 } } )
    assertXmlSimpleValueException( \ ->{ xml.MaxLengthHexBinary5_elem.$Value = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 } } )

    xml.MaxLengthHexBinary5 = { 0, 0, 0, 0, 0 }
    xml.MaxLengthHexBinary5 = { 0, 0, 0, 0 }
    xml.MaxLengthHexBinary5 = { 0 }
    xml.MaxLengthHexBinary5 = {}
  }

  @Test
  function testMaxLengthFacetWithBase64Binary() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

// Not currently enforced, due to the possibility of a huge base64 input
//    assertXmlSimpleValueException( \ ->{ xml.MaxLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0 } } )
//    assertXmlSimpleValueException( \ ->{ xml.MaxLengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0, 0, 0 } } )
//
//    assertXmlSimpleValueException( \ ->{ xml.MaxLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 } } )
//    assertXmlSimpleValueException( \ ->{ xml.MaxLengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 } } )

    xml.MaxLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0 }
    xml.MaxLengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0, 0, 0 }

    xml.MaxLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
    xml.MaxLengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }

    xml.MaxLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0 }
    xml.MaxLengthBase64Binary5.Bytes = { 0, 0, 0, 0 }
    xml.MaxLengthBase64Binary5.Bytes = { 0 }
    xml.MaxLengthBase64Binary5.Bytes = {}
  }

  @Test
  function testMinLengthFacetWithString() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MinLengthString5 = "1234" } )
    assertXmlSimpleValueException( \ ->{ xml.MinLengthString5_elem.$Value = "1234" } )

    assertXmlSimpleValueException( \ ->{ xml.MinLengthString5 = "" } )
    assertXmlSimpleValueException( \ ->{ xml.MinLengthString5_elem.$Value = "" } )

    xml.MinLengthString5 = "12345"
    xml.MinLengthString5 = "123456"
    xml.MinLengthString5 = "1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
  }

  @Test
  function testMinLengthFacetWithHexBinary() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MinLengthHexBinary5 = { 0, 0, 0, 0 } } )
    assertXmlSimpleValueException( \ ->{ xml.MinLengthHexBinary5_elem.$Value = { 0, 0, 0, 0 } } )

    assertXmlSimpleValueException( \ ->{ xml.MinLengthHexBinary5 = {} } )
    assertXmlSimpleValueException( \ ->{ xml.MinLengthHexBinary5_elem.$Value = {} } )

    xml.MinLengthHexBinary5 = { 0, 0, 0, 0, 0 }
    xml.MinLengthHexBinary5 = { 0, 0, 0, 0, 0, 0 }
    xml.MinLengthHexBinary5 = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
  }

  @Test
  function testMinLengthFacetWithBase64Binary() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

// Not currently enforced, due to the possibility of a huge base64 input
//    assertXmlSimpleValueException( \ ->{ xml.MinLengthBase64Binary5.Bytes = { 0, 0, 0, 0 } } )
//    assertXmlSimpleValueException( \ ->{ xml.MinLengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0 } } )
//
//    assertXmlSimpleValueException( \ ->{ xml.MinLengthBase64Binary5.Bytes = {} } )
//    assertXmlSimpleValueException( \ ->{ xml.MinLengthBase64Binary5_elem.$Value.Bytes = {} } )

    xml.MinLengthBase64Binary5.Bytes = { 0, 0, 0, 0 }
    xml.MinLengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0 }

    xml.MinLengthBase64Binary5.Bytes = {}
    xml.MinLengthBase64Binary5_elem.$Value.Bytes = {}

    xml.MinLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0 }
    xml.MinLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0 }
    xml.MinLengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 }
  }

  @Test
  function testLengthFacetWithString() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.LengthString5 = "123456" } )
    assertXmlSimpleValueException( \ ->{ xml.LengthString5_elem.$Value = "123456" } )

    assertXmlSimpleValueException( \ ->{ xml.LengthString5 = "1234" } )
    assertXmlSimpleValueException( \ ->{ xml.LengthString5_elem.$Value = "1234" } )

    assertXmlSimpleValueException( \ ->{ xml.LengthString5 = "" } )
    assertXmlSimpleValueException( \ ->{ xml.LengthString5_elem.$Value = "" } )

    xml.LengthString5 = "12345"
    xml.LengthString5_elem.$Value = "12345"

  }

  @Test
  function testLengthFacetWithHexBinary() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.LengthHexBinary5 = { 0, 0, 0, 0, 0, 0 } } )
    assertXmlSimpleValueException( \ ->{ xml.LengthHexBinary5_elem.$Value = { 0, 0, 0, 0, 0, 0 } } )

    assertXmlSimpleValueException( \ ->{ xml.LengthHexBinary5 = { 0, 0, 0, 0 } } )
    assertXmlSimpleValueException( \ ->{ xml.LengthHexBinary5_elem.$Value = { 0, 0, 0, 0 } } )

    assertXmlSimpleValueException( \ ->{ xml.LengthHexBinary5 = {} } )
    assertXmlSimpleValueException( \ ->{ xml.LengthHexBinary5_elem.$Value = {} } )

    xml.LengthHexBinary5 = { 0, 0, 0, 0, 0 }
    xml.LengthHexBinary5_elem.$Value = { 0, 0, 0, 0, 0 }

  }

  @Test
  function testLengthFacetWithBase64Binary() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

// Not currently enforced, due to the possibility of a huge base64 input
//    assertXmlSimpleValueException( \ ->{ xml.LengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0 } } )
//    assertXmlSimpleValueException( \ ->{ xml.LengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0, 0, 0 } } )
//
//    assertXmlSimpleValueException( \ ->{ xml.LengthBase64Binary5.Bytes = { 0, 0, 0, 0 } } )
//    assertXmlSimpleValueException( \ ->{ xml.LengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0 } } )
//
//    assertXmlSimpleValueException( \ ->{ xml.LengthBase64Binary5.Bytes = {} } )
//    assertXmlSimpleValueException( \ ->{ xml.LengthBase64Binary5_elem.$Value.Bytes = {} } )

    xml.LengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0, 0 }
    xml.LengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0, 0, 0 }

    xml.LengthBase64Binary5.Bytes = { 0, 0, 0, 0 }
    xml.LengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0 }

    xml.LengthBase64Binary5.Bytes = {}
    xml.LengthBase64Binary5_elem.$Value.Bytes = {}

    xml.LengthBase64Binary5.Bytes = { 0, 0, 0, 0, 0 }
    xml.LengthBase64Binary5_elem.$Value.Bytes = { 0, 0, 0, 0, 0 }

  }

  @Test
  function testMaxExclusiveFacet() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MaxExclusive10 = Integer.MAX_VALUE } )
    assertXmlSimpleValueException( \ ->{ xml.MaxExclusive10 = 11 } )
    assertXmlSimpleValueException( \ ->{ xml.MaxExclusive10 = 10 } )
    xml.MaxExclusive10 = 9
    xml.MaxExclusive10 = 8
    xml.MaxExclusive10 = 0
    xml.MaxExclusive10 = -1
    xml.MaxExclusive10 = -9
    xml.MaxExclusive10 = -10
    xml.MaxExclusive10 = -11
    xml.MaxExclusive10 = Integer.MIN_VALUE
  }

  @Test
  function testMaxInclusiveFacet() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MaxInclusive10 = Integer.MAX_VALUE } )
    assertXmlSimpleValueException( \ ->{ xml.MaxInclusive10 = 11 } )
    xml.MaxInclusive10 = 10
    xml.MaxInclusive10 = 9
    xml.MaxInclusive10 = 8
    xml.MaxInclusive10 = 0
    xml.MaxInclusive10 = -1
    xml.MaxInclusive10 = -9
    xml.MaxInclusive10 = -10
    xml.MaxInclusive10 = -11
    xml.MaxInclusive10 = Integer.MIN_VALUE
  }

  @Test
  function testMinExclusiveFacet() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = Integer.MIN_VALUE } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = -11 } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = -10 } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = -9 } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = -1 } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = 0 } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = 8 } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = 9 } )
    assertXmlSimpleValueException( \ ->{ xml.MinExclusive10 = 10 } )
    xml.MinExclusive10 = 11
    xml.MinExclusive10 = 12
    xml.MinExclusive10 = 50
    xml.MinExclusive10 = Integer.MAX_VALUE
  }

  @Test
  function testMinInclusiveFacet() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = Integer.MIN_VALUE } )
    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = -11 } )
    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = -10 } )
    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = -9 } )
    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = -1 } )
    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = 0 } )
    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = 8 } )
    assertXmlSimpleValueException( \ ->{ xml.MinInclusive10 = 9 } )
    xml.MinInclusive10 = 10
    xml.MinInclusive10 = 11
    xml.MinInclusive10 = 12
    xml.MinInclusive10 = 50
    xml.MinInclusive10 = Integer.MAX_VALUE
  }

  @Test
  function testPatternFacetSimple() {
    // more tests could be added for xsd:pattern, but since we're delegating to the xmlbeans regex impl, the entire validator
    // is only a few lines of code on our end, so we'd essentially be testing the xmlbeans impl, which wouldn't be a bad thing necessarily
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters = "" } ) // requires at least one letter
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters_elem.$Value = "" } ) // requires at least one letter
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters = "a" } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters_elem.$Value = "a" } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters = " " } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters_elem.$Value = " " } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters = "foo" } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters_elem.$Value = "foo" } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters = "FOO BAR" } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters_elem.$Value = "FOO BAR" } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters = "FOOxBAR" } )
    assertXmlSimpleValueException( \ ->{ xml.PatternAllCapitalEnglishLetters_elem.$Value = "FOOxBAR" } )

    xml.PatternAllCapitalEnglishLetters = "Q";
    xml.PatternAllCapitalEnglishLetters_elem.$Value = "Q";

    xml.PatternAllCapitalEnglishLetters = "FOOBAR";
    xml.PatternAllCapitalEnglishLetters_elem.$Value = "FOOBAR";
  }

  @Test
  function testSimpleFacetFromSchemaSchema() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()
    assertXmlSimpleValueException( \ ->{ xml.PositiveInteger = -1 } )
    assertXmlSimpleValueException( \ ->{ xml.PositiveInteger = 0 } )
    xml.PositiveInteger = 1
  }

  @Test
  function testMultipleFacetsOnSingleElementAreHandledAsAND() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = Integer.MIN_VALUE } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = -1 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = 0 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = 3 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = 4 } )
    xml.Min5Max8 = 5
    xml.Min5Max8 = 6
    xml.Min5Max8 = 7
    xml.Min5Max8 = 8
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = 9 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = 10 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8 = Integer.MAX_VALUE } )
  }

  @Test
  function testMultipleFacetsOnSingleElementDueToSimpleTypeInheritenceAreHandledAsAND() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = Integer.MIN_VALUE } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = -1 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = 0 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = 3 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = 4 } )
    xml.Min5Max8ThroughInheritence = 5
    xml.Min5Max8ThroughInheritence = 6
    xml.Min5Max8ThroughInheritence = 7
    xml.Min5Max8ThroughInheritence = 8
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = 9 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = 10 } )
    assertXmlSimpleValueException( \ ->{ xml.Min5Max8ThroughInheritence = Integer.MAX_VALUE } )
  }

  @Test
  function testMultiplePatternFacetsOnSingleElementAreHandledAsOR() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.AllowsPattern1Or2 = 0 } )
    xml.AllowsPattern1Or2 = 1
    xml.AllowsPattern1Or2 = 2
    assertXmlSimpleValueException( \ ->{ xml.AllowsPattern1Or2 = 3 } )
    assertXmlSimpleValueException( \ ->{ xml.AllowsPattern1Or2 = 4 } )
  }

  @Test
  function testMultiplePatternFacetsOnSingleElementDueToSimpleTypeInheritenceAreHandledAsAND() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()

    assertXmlSimpleValueException( \ ->{ xml.AllowsPattern2ButNot1Or3 = 0 } )
    assertXmlSimpleValueException( \ ->{ xml.AllowsPattern2ButNot1Or3 = 1 } )
    xml.AllowsPattern1Or2 = 2
    assertXmlSimpleValueException( \ ->{ xml.AllowsPattern2ButNot1Or3 = 3 } )
    assertXmlSimpleValueException( \ ->{ xml.AllowsPattern2ButNot1Or3 = 4 } )
  }


  @Test
  function testXmlSchemaSimpleTypeListDoesNotValidateLengthFacetUntilSerialized() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.SimpleType[0].Name = "MyType"
    schema.SimpleType[0].List.ItemType = schema.$Namespace.qualify( "int" )
    schema.Element[0].Name = "Root"
    schema.Element[0].SimpleType.Restriction.Base = new( "MyType" )
    schema.Element[0].SimpleType.Restriction.Length[0].Value = 5

    //TODO - REIMPLEMENT
//    XmlSchemaTestUtil.runWithResource( schema, {
//        "var xml = new $$TESTPACKAGE$$.schema.Root()",
//        "xml.$Value = { 1, 2, 3, 4 }",
//        "assertExceptionThrown( \\ -> xml.parse( xml.bytes() ), gw.xml.XmlException )",
//        "xml.$Value = { 1, 2, 3, 4, 5 }",
//        "xml.parse( xml.bytes() )",
//        "xml.$Value = { 1, 2, 3, 4, 5, 6 }",
//        "assertExceptionThrown( \\ -> xml.parse( xml.bytes() ), gw.xml.XmlException )",
//        ""
//    } )
  }

}
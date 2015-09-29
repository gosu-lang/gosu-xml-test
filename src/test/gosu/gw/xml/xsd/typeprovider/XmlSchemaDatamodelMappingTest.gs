package gw.xml.xsd.typeprovider

uses java.lang.Double
uses java.lang.Integer
uses java.lang.Float
uses gw.xml.XmlSimpleValueException
uses javax.xml.namespace.QName
uses gw.xml.XmlElement
uses java.net.URI
uses java.util.Date
uses java.util.Calendar
uses java.util.TimeZone
uses gw.xml.date.*
uses java.lang.*
uses java.math.BigDecimal
uses java.math.BigInteger
uses java.util.ArrayList
uses java.util.GregorianCalendar
uses org.junit.ComparisonFailure
uses org.junit.Test

/**
 * Created by carson on 9/28/15.
 */
class XmlSchemaDatamodelMappingTest extends XSDTest {

  @Test
  function testFloat() {
    var xml = new gw.xml.xsd.typeprovider.test.FloatingPointTest()
    assertEquals( Float, statictypeof xml.Float )
    for ( i in -20..20 ) {
      for ( j in -20..20 ) {
        var d = ( i as float ) / ( j as float )
        var s = String.valueOf( d )
        if ( s == "Infinity" ) {
          s = "INF"
        }
        if ( s == "-Infinity" ) {
          s = "-INF"
        }
        assertFloatWorks( d, s )
      }
    }
    assertFloatWorks( 0.0 as float, "0.0" )
    // Unlike xsd:double, specification does not allow for a negative zero for xsd:float... Lexical representation -0.0 is allowed, but it resolves to the same as 0.0
    // I think it's still ok for us to pass the negative sign through
    assertFloatWorks( -0.0 as float, "-0.0" )
    assertFloatWorks( NaN as float, "NaN" )
    assertFloatWorks( Infinity as float, "INF" )
    assertFloatWorks( -Infinity as float, "-INF" )
    assertFloatWorks( 9999999999999 as float, "9.9999998E12" )

    assertExceptionThrown( \ ->assertFloatWorks( Infinity as float, "Infinity" ), ComparisonFailure )
    assertExceptionThrown( \ ->assertFloatWorks( -Infinity as float, "-Infinity" ), ComparisonFailure )

  }

  @Test
  function testDouble() {
    var xml = new gw.xml.xsd.typeprovider.test.FloatingPointTest()
    assertEquals( Double, statictypeof xml.Double )
    for ( i in -20..20 ) {
      for ( j in -20..20 ) {
        var d = ( i as double ) / ( j as double )
        var s = String.valueOf( d )
        if ( s == "Infinity" ) {
          s = "INF"
        }
        if ( s == "-Infinity" ) {
          s = "-INF"
        }
        assertDoubleWorks( d, s )
      }
    }
    assertDoubleWorks( 0.0, "0.0" )
    assertDoubleWorks( -0.0, "-0.0" )
    assertDoubleWorks( NaN, "NaN" )
    assertDoubleWorks( Infinity, "INF" )
    assertDoubleWorks( -Infinity, "-INF" )
    assertDoubleWorks( 999999999999999999999999999999999999.0, "1.0E36" )

    assertExceptionThrown( \ ->assertDoubleWorks( Infinity, "Infinity" ), ComparisonFailure )
    assertExceptionThrown( \ ->assertDoubleWorks( -Infinity, "-Infinity" ), ComparisonFailure )

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // XML Schema has two representations for positive infinity, INF and +INF - they are equivalent, but our validator
    // doesn't currently support "+INF" as of 11/20/2009.
    //
    // Caused by: org.xml.sax.SAXParseException: cvc-datatype-valid.1.2.1: '+INF' is not a valid value for 'double'.
    //
    // From http://www.w3.org/TR/xmlschema11-2/#sec-chnum :
    //     "The character sequence '+INF' has been added to the lexical spaces of float and double."
    //
    //xml = xml.parse( "<FloatingPointTest><double>+INF</double></FloatingPointTest>" )
    //assertEquals( Infinity, xml.Double )
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  }

  function assertFloatWorks( f : float, s : String ) {
    var xml = new gw.xml.xsd.typeprovider.test.FloatingPointTest()
    xml.Float = f
    assertEquals( s, xml.Float_elem.$Text )
    xml = gw.xml.xsd.typeprovider.test.FloatingPointTest.parse( "<FloatingPointTest><float>${ s }</float></FloatingPointTest>" )
    assertEquals( f, xml.Float, 0f )
    assertEquals( Float, typeof xml.Float )
  }

  function assertDoubleWorks( d : double, s : String ) {
    var xml = new gw.xml.xsd.typeprovider.test.FloatingPointTest()
    xml.Double = d
    assertEquals( s, xml.Double_elem.$Text )
    xml = gw.xml.xsd.typeprovider.test.FloatingPointTest.parse( "<FloatingPointTest><double>${ s }</double></FloatingPointTest>" )
    assertEquals( d, xml.Double, 0 )
    assertEquals( Double, typeof xml.Double )
  }

  @Test
  function testTimeZoneHandling()
  {
    assertEquals( - ( 23 * 3600000 + 59 * 60000 ), new XmlYear( "2008-23:59" ).TimeZone.getOffset( 0 ) )
    assertEquals( - ( 12 * 3600000 + 34 * 60000 ), new XmlYear( "2008-12:34" ).TimeZone.getOffset( 0 ) )
    assertEquals( 0, new XmlYear( "2008+00:00" ).TimeZone.getOffset( 0 ) )
    assertEquals( 0, new XmlYear( "2008-00:00" ).TimeZone.getOffset( 0 ) )
    assertEquals( 0, new XmlYear( "2008Z" ).TimeZone.getOffset( 0 ) )
    assertEquals( 12 * 3600000 + 34 * 60000, new XmlYear( "2008+12:34" ).TimeZone.getOffset( 0 ) )
    assertEquals( 23 * 3600000 + 59 * 60000, new XmlYear( "2008+23:59" ).TimeZone.getOffset( 0 ) )
    assertNull( new XmlYear( "2008" ).TimeZone )
    assertNotNull( new XmlYear( "2008Z" ).TimeZone )
    assertEquals( 0, new XmlYear( "2008Z" ).TimeZone.getOffset( 0 ) )
    assertBad( XmlYear, "2008+24:00" ) // 24:00 is out of range
    assertBad( XmlYear, "2008-24:00" ) // -24:00 is out of range
    assertBad( XmlYear, "2008-Z" ) // -Z is not valid
    assertBad( XmlYear, "2008+" )
    assertBad( XmlYear, "2008-" )
    assertBad( XmlYear, "2008+0" )
    assertBad( XmlYear, "2008+0:0" )
    assertBad( XmlYear, "2008+00:0" )
    assertBad( XmlYear, "2008+0:00" )
  }

  @Test
  function testXSDSimpleDataTypes()
  {
    var cal : Calendar = Calendar.getInstance(TimeZone.getTimeZone( "GMT+00:00" ))
    cal.Time = new Date(0 as long)
    var xml = new gw.xml.xsd.typeprovider.tst.Root()

    xml.Boolean = true
    xml.Byte = Byte.MAX_VALUE
    xml.Decimal = new BigDecimal("12345678901234567890123456789012345678901234567890.12345678901234567890123456789012345678901234567890")
    xml.Double = Double.MAX_VALUE
    xml.Float = Float.MAX_VALUE
    xml.Int = Integer.MAX_VALUE
    xml.Integer = new BigInteger("12345678901234567890123456789012345678901234567890")
    xml.Long = Long.MAX_VALUE
    xml.Short = Short.MAX_VALUE
    xml.String = "foo bar"

    xml.UnsignedByte = 255
    xml.UnsignedShort = 65535
    xml.UnsignedInt = 4294967295
    xml.UnsignedLong = 18446744073709551615

    // Date-related fields
    xml.Date = new XmlDate( cal, true )
    xml.Date2 = new XmlDate( cal, false )
    xml.DateTime = new XmlDateTime( cal, true )
    xml.DateTime2 = new XmlDateTime( cal, false )
    xml.Time = new XmlTime( cal, true )
    xml.Time2 = new XmlTime( cal, false )
    xml.GYearMonth = new XmlYearMonth( cal, true )
    xml.GYearMonth2 = new XmlYearMonth( cal, false )
    xml.GYear = new XmlYear( cal, true )
    xml.GYear2 = new XmlYear( cal, false )
    xml.GMonthDay = new XmlMonthDay( cal, true )
    xml.GMonthDay2 = new XmlMonthDay( cal, false )
    xml.GDay = new XmlDay( cal, true )
    xml.GDay2 = new XmlDay( cal, false )
    xml.GMonth = new XmlMonth( cal, true )
    xml.GMonth2 = new XmlMonth( cal, false )

    assertEquals(true, xml.Boolean as boolean)
//    assertEquals(Byte.MAX_VALUE, xml.Byte)
    assertEquals(new BigDecimal("12345678901234567890123456789012345678901234567890.12345678901234567890123456789012345678901234567890"), xml.Decimal)
    assertEquals(Double.MAX_VALUE, xml.Double, 0d)
    assertEquals(Float.MAX_VALUE, xml.Float, 0d)
    assertEquals(Integer.MAX_VALUE, xml.Int)
    assertEquals(new BigInteger( "12345678901234567890123456789012345678901234567890" ), xml.Integer)
    assertEquals(Long.MAX_VALUE, xml.Long, 0)
    assertEquals(Short.MAX_VALUE, xml.Short, 0)
    assertEquals("foo bar", xml.String)

    assertEquals( Short, statictypeof xml.UnsignedByte )
    assertEquals( Short, typeof xml.UnsignedByte )
    assertEquals( 255 as short, xml.UnsignedByte )

    assertEquals( Integer, statictypeof xml.UnsignedShort )
    assertEquals( Integer, typeof xml.UnsignedShort )
    assertEquals( 65535, xml.UnsignedShort )

    assertEquals( Long, statictypeof  xml.UnsignedInt )
    assertEquals( Long, typeof  xml.UnsignedInt )
    assertEquals( 4294967295, xml.UnsignedInt )

    assertEquals( BigInteger, statictypeof xml.UnsignedLong )
    assertEquals( BigInteger, typeof xml.UnsignedLong )
    assertEquals( 18446744073709551615, xml.UnsignedLong )

    // Date-related fields
    assertEquals(new XmlDate( cal, true ), xml.Date)
    assertEquals(new XmlDate( cal, false ), xml.Date2)
    assertEquals(new XmlDateTime( cal, true ), xml.DateTime)
    assertEquals(new XmlDateTime( cal, false ), xml.DateTime2)
    assertEquals(new XmlTime( cal, true ), xml.Time)
    assertEquals(new XmlTime( cal, false ), xml.Time2)
    assertEquals(new XmlYearMonth( cal, true ), xml.GYearMonth)
    assertEquals(new XmlYearMonth( cal, false ), xml.GYearMonth2)
    assertEquals(new XmlYear( cal, true ), xml.GYear)
    assertEquals(new XmlYear( cal, false ), xml.GYear2)
    assertEquals(new XmlMonthDay( cal, true ), xml.GMonthDay)
    assertEquals(new XmlMonthDay( cal, false ), xml.GMonthDay2)
    assertEquals(new XmlDay( cal, true ), xml.GDay)
    assertEquals(new XmlDay( cal, false ), xml.GDay2)
    assertEquals(new XmlMonth( cal, true ), xml.GMonth)
    assertEquals(new XmlMonth( cal, false ), xml.GMonth2)

    xml = xml.parse( xml.bytes() )

    assertEquals("true", xml.Boolean_elem.$Text)
    assertEquals("127", xml.Byte_elem.$Text)
    assertEquals("12345678901234567890123456789012345678901234567890.12345678901234567890123456789012345678901234567890", xml.Decimal_elem.$Text)
    assertEquals("1.7976931348623157E308", xml.Double_elem.$Text)
    assertEquals("3.4028235E38", xml.Float_elem.$Text)
    assertEquals("2147483647", xml.Int_elem.$Text)
    assertEquals("12345678901234567890123456789012345678901234567890", xml.Integer_elem.$Text)
    assertEquals("9223372036854775807", xml.Long_elem.$Text)
    assertEquals("32767", xml.Short_elem.$Text)
    assertEquals("foo bar", xml.String_elem.$Text)

    assertEquals("255", xml.UnsignedByte_elem.$Text)
    assertEquals("65535", xml.UnsignedShort_elem.$Text)
    assertEquals("4294967295", xml.UnsignedInt_elem.$Text)
    assertEquals("18446744073709551615", xml.UnsignedLong_elem.$Text)

    // Date-related fields
    assertEquals("1970-01-01+00:00", xml.Date_elem.$Text)
    assertEquals("1970-01-01", xml.Date2_elem.$Text)
    assertEquals("1970-01-01T00:00:00+00:00", xml.DateTime_elem.$Text)
    assertEquals("1970-01-01T00:00:00", xml.DateTime2_elem.$Text)
    assertEquals("00:00:00+00:00", xml.Time_elem.$Text)
    assertEquals("00:00:00", xml.Time2_elem.$Text)
    assertEquals("1970-01+00:00", xml.GYearMonth_elem.$Text)
    assertEquals("1970-01", xml.GYearMonth2_elem.$Text)
    assertEquals("1970+00:00", xml.GYear_elem.$Text)
    assertEquals("1970", xml.GYear2_elem.$Text)
    assertEquals("--01-01+00:00", xml.GMonthDay_elem.$Text)
    assertEquals("--01-01", xml.GMonthDay2_elem.$Text)
    assertEquals("---01+00:00", xml.GDay_elem.$Text)
    assertEquals("---01", xml.GDay2_elem.$Text)
    assertEquals("--01+00:00", xml.GMonth_elem.$Text)
    assertEquals("--01", xml.GMonth2_elem.$Text)

    assertEquals(Boolean, typeof xml.Boolean)
    assertEquals(Byte, typeof xml.Byte)
    assertEquals(BigDecimal, typeof xml.Decimal)
    assertEquals(Double, typeof xml.Double)
    assertEquals(Float, typeof xml.Float)
    assertEquals(Integer, typeof xml.Int)
    assertEquals(BigInteger, typeof xml.Integer)
    assertEquals(Long, typeof xml.Long)
    assertEquals(Short, typeof xml.Short)
    assertEquals(String, typeof xml.String)

    assertEquals(Short, typeof xml.UnsignedByte)
    assertEquals(Integer, typeof xml.UnsignedShort)
    assertEquals(Long, typeof xml.UnsignedInt)
    assertEquals(BigInteger, typeof xml.UnsignedLong)

    // Date-related fields

    assertEquals(XmlDate, typeof xml.Date)
    assertEquals(XmlDate, typeof xml.Date2)
    assertEquals(XmlDateTime, typeof xml.DateTime)
    assertEquals(XmlDateTime, typeof xml.DateTime2)
    assertEquals(XmlTime, typeof xml.Time)
    assertEquals(XmlTime, typeof xml.Time2)
    assertEquals(XmlYearMonth, typeof xml.GYearMonth)
    assertEquals(XmlYearMonth, typeof xml.GYearMonth2)
    assertEquals(XmlYear, typeof xml.GYear)
    assertEquals(XmlYear, typeof xml.GYear2)
    assertEquals(XmlMonthDay, typeof xml.GMonthDay)
    assertEquals(XmlMonthDay, typeof xml.GMonthDay2)
    assertEquals(XmlDay, typeof xml.GDay)
    assertEquals(XmlDay, typeof xml.GDay2)
    assertEquals(XmlMonth, typeof xml.GMonth)
    assertEquals(XmlMonth, typeof xml.GMonth2)

    assertEquals(Boolean, statictypeof xml.Boolean)
    assertEquals(Byte, statictypeof xml.Byte)
    assertEquals(BigDecimal, statictypeof xml.Decimal)
    assertEquals(Double, statictypeof xml.Double)
    assertEquals(Float, statictypeof xml.Float)
    assertEquals(Integer, statictypeof xml.Int)
    assertEquals(BigInteger, statictypeof xml.Integer)
    assertEquals(Long, statictypeof xml.Long)
    assertEquals(Short, statictypeof xml.Short)
    assertEquals(String, statictypeof xml.String)

    assertEquals(Short, statictypeof xml.UnsignedByte)
    assertEquals(Integer, statictypeof xml.UnsignedShort)
    assertEquals(Long, statictypeof xml.UnsignedInt)
    assertEquals(BigInteger, statictypeof xml.UnsignedLong)

    // Date-related fields
    assertEquals(XmlDate, statictypeof xml.Date)
    assertEquals(XmlDate, statictypeof xml.Date2)
    assertEquals(XmlDateTime, statictypeof xml.DateTime)
    assertEquals(XmlDateTime, statictypeof xml.DateTime2)
    assertEquals(XmlTime, statictypeof xml.Time)
    assertEquals(XmlTime, statictypeof xml.Time2)
    assertEquals(XmlYearMonth, statictypeof xml.GYearMonth)
    assertEquals(XmlYearMonth, statictypeof xml.GYearMonth2)
    assertEquals(XmlYear, statictypeof xml.GYear)
    assertEquals(XmlYear, statictypeof xml.GYear2)
    assertEquals(XmlMonthDay, statictypeof xml.GMonthDay)
    assertEquals(XmlMonthDay, statictypeof xml.GMonthDay2)
    assertEquals(XmlDay, statictypeof xml.GDay)
    assertEquals(XmlDay, statictypeof xml.GDay2)
    assertEquals(XmlMonth, statictypeof xml.GMonth)
    assertEquals(XmlMonth, statictypeof xml.GMonth2)

    assertXmlDateEqualsContract( XmlDateTime )
    assertXmlDateEqualsContract( XmlDate )
    assertXmlDateEqualsContract( XmlTime )
    assertXmlDateEqualsContract( XmlYearMonth )
    assertXmlDateEqualsContract( XmlYear )
    assertXmlDateEqualsContract( XmlMonthDay )
    assertXmlDateEqualsContract( XmlDay )
    assertXmlDateEqualsContract( XmlMonth )

    xml.Double = NaN
    assertTrue( Double.isNaN( xml.Double ) )

    xml.Double = Infinity
    assertEquals( Infinity, xml.Double, 0d )

    xml.Double = -Infinity
    assertEquals( -Infinity, xml.Double, 0d )

  }

  @Test
  function testNormalizedString()
  {
    var nonNormalizedString = "foo bar baz" // we no longer normalize strings for the user - they must supply a normalized value
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.NormalizedString = nonNormalizedString
    assertEquals( "foo bar baz", xml.NormalizedString )
    xml = xml.parse( xml.bytes() )
    assertEquals( "foo bar baz", xml.NormalizedString )
    assertEquals( String, typeof xml.NormalizedString )
    assertEquals( gw.xsd.w3c.xmlschema.types.simple.NormalizedString, typeof xml.NormalizedString_elem.$TypeInstance );
    assertEquals( gw.xsd.w3c.xmlschema.types.simple.NormalizedString, statictypeof xml.NormalizedString_elem.$TypeInstance );
  }

  @Test
  function testHexBinary()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.HexBinary = new byte[] { 1, -1, 2, 3 }
    assertEquals( "01FF0203", xml.HexBinary_elem.$Text )
    xml = xml.parse( xml.bytes() )
    assertEquals( 1 as byte, xml.HexBinary[0] )
    assertEquals( -1 as byte, xml.HexBinary[1] )
    assertEquals( 2 as byte, xml.HexBinary[2] )
    assertEquals( 3 as byte, xml.HexBinary[3] )
  }

  @Test
  function testBase64Binary()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.Base64Binary.Bytes = "foobarbaz".getBytes( "UTF-8" )
    assertEquals( "Zm9vYmFyYmF6", xml.Base64Binary_elem.$Text )
    xml = xml.parse( xml.bytes() )
    assertEquals( "foobarbaz", new String( xml.Base64Binary.Bytes, "UTF-8" ))
  }

  @Test
  function testAnyURI()
  {
    var url = "http://guidewire.com#%20foo+bar"
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.AnyURI = new URI( url )
    assertEquals( new URI( url ), xml.AnyURI )
    assertEquals( url, xml.AnyURI_elem.$Text )
  }

  @Test
  function testIRI() {
    // anyURI is actually an IRI according to spec - see http://www.ietf.org/rfc/rfc3987 for more info on IRIs
    var uri = "http://" + ( 1071 as char ) // Cyrillic capital ya
    assertEquals( 8, uri.length )
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.AnyURI = new URI( uri )
    assertEquals( uri, xml.AnyURI_elem.$Text )
    assertTrue(xml.asUTFString().contains(uri))
    var byteString = new String( xml.bytes(), "ISO-8859-1" )
    assertTrue(byteString.contains("http://${208 as char}${175 as char}"))
    assertEquals( "http://%D0%AF", xml.AnyURI.toASCIIString() )
    xml = xml.parse( xml.bytes() )
    assertEquals( uri, xml.AnyURI_elem.$Text )
    assertTrue( xml.asUTFString().contains(uri))
    byteString = new String( xml.bytes(), "ISO-8859-1" )
    assertTrue( byteString.contains("http://${208 as char}${175 as char}"))
    assertEquals( "http://%D0%AF", xml.AnyURI.toASCIIString() )
  }

  @Test
  function testIDREFOld()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREF = xml
    xml.IDREFAttr = xml
    assertSame( xml, xml.IDREF )
    assertSame( xml, xml.IDREFAttr )
    xml = gw.xml.xsd.typeprovider.tst.Root.parse( xml.asUTFString() )
    assertSame( xml, xml.IDREF )
    assertSame( xml, xml.IDREFAttr )
    xml.ID = "foo"
    assertEquals( 4, xml.asUTFString().split( "foo" ).length )
    xml = gw.xml.xsd.typeprovider.tst.Root.parse( xml.asUTFString() )
    assertSame( xml, xml.IDREF )
    assertSame( xml, xml.IDREFAttr )
    assertEquals( "foo", xml.ID )
//    assertEquals( "foo", xml.NodeID )
  }

  @Test
  function testIDREFS()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREFS = { xml }
    xml.IDREFSAttr = { xml, xml, xml }
    assertEquals( 1, xml.IDREFS.Count )
    assertEquals( 3, xml.IDREFSAttr.Count )
    assertSame( xml, xml.IDREFS[0] )
    assertSame( xml, xml.IDREFSAttr[1] )
    assertEquals( List<XmlElement>, typeof xml.IDREFS ) // TODO dlank - make an XmlElementWithID class?
    assertEquals( List<XmlElement>, typeof xml.IDREFSAttr )
    xml = gw.xml.xsd.typeprovider.tst.Root.parse( xml.asUTFString() )
    assertEquals( 1, xml.IDREFS.Count )
    assertEquals( 3, xml.IDREFSAttr.Count )
    assertSame( xml, xml.IDREFS[0] )
    assertSame( xml, xml.IDREFSAttr[1] )
    xml.ID = "foo"
    assertEquals( 1, xml.IDREFS.Count )
    assertEquals( 3, xml.IDREFSAttr.Count )
    assertSame( xml, xml.IDREFS[0] )
    assertSame( xml, xml.IDREFSAttr[1] )
    assertEquals( List<XmlElement>, typeof xml.IDREFS )
    assertEquals( List<XmlElement>, typeof xml.IDREFSAttr )
    xml = gw.xml.xsd.typeprovider.tst.Root.parse( xml.asUTFString() )
    assertEquals( 1, xml.IDREFS.Count )
    assertEquals( 3, xml.IDREFSAttr.Count )
    assertSame( xml, xml.IDREFS[0] )
    assertSame( xml, xml.IDREFSAttr[1] )
    assertEquals( "foo", xml.ID )
//    assertEquals( "foo", xml.NodeID )
    assertEquals( List<XmlElement>, typeof xml.IDREFS )
    assertEquals( List<XmlElement>, typeof xml.IDREFSAttr )
  }

  @Test
  function testIDREFSMakesCopyOfList()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    var list = new ArrayList<XmlElement>()
    list.add( xml )
    list.add( xml )
    xml.IDREFS = list
    xml.IDREFSAttr = xml.IDREFS
    list.add( xml ) // ignored
    list.add( xml ) // ignored
    list.add( xml ) // ignored
    list.add( xml ) // ignored
    list.add( xml ) // ignored
    xml.IDREFS.add( xml ) // only affects IDREFS, not IDREFSAttr
    assertEquals( 3, xml.IDREFS.size())
    assertEquals( 2, xml.IDREFSAttr.size())
  }

  @Test
  function testIDREFSListImplementationIteratorRemove()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREFS = { xml, xml, xml }
    assertEquals( List<XmlElement>, typeof xml.IDREFS )
    var iter = xml.IDREFS.iterator()
    iter.next()
    iter.next()
    iter.remove()
    assertEquals( 2, xml.IDREFS.size())
  }

  @Test
  function testIDREFSListImplementationListIteratorAddMethodCausesIDPropertyToBeSet()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.Root = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREFS = { xml.Root }
    var iter = xml.IDREFS.listIterator()
    var xml2 = xml.parse( xml.bytes() )
    assertNull( xml2.ID )
    assertEquals(1, xml.IDREFS.size())
    iter.add( xml )
    xml2 = xml.parse( xml.bytes() )
    assertNotNull( xml2.ID )
    assertEquals( 2, xml.IDREFS.size())
  }

  @Test
  function testIDREFSListImplementationListIteratorSetMethodCausesIDPropertyToBeSet()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.Root = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREFS = { xml.Root }
    var iter = xml.IDREFS.listIterator()
    var xml2 = xml.parse( xml.bytes() )
    assertNull( xml2.ID )
    assertEquals( 1, xml.IDREFS.size())
    iter.next()
    iter.set( xml )
    xml2 = xml.parse( xml.bytes() )
    assertNotNull( xml2.ID )
    assertEquals(1, xml.IDREFS.size())
  }

  @Test
  function testIDREFAttributeDeserializationFromStringThrowsXmlSimpleValueException() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Name = "ref"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "IDREF" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"ref\", \"foo\" )",
        "try {",
        "  print( xml.Ref )",
        "  fail( \"Expected XmlSimpleValueException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSimpleValueException ) {",
        "  // good",
        "  assertEquals( ex.Message, \"Unresolved IDREF. Attempt to deserialize IDREF outside of parse operation.\" )",
        "}"
    } )
  }

  @Test
  function testIDREFSAttributeDeserializationFromStringThrowsXmlSimpleValueException() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Name = "refs"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "IDREFS" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.setAttributeValue( \"refs\", \"foo\" )",
        "try {",
        "  print( xml.Refs )",
        "  fail( \"Expected XmlSimpleValueException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSimpleValueException ) {",
        "  // good",
        "  assertEquals( ex.Message, \"Unresolved IDREF. Attempt to deserialize IDREF outside of parse operation.\" )",
        "}"
    } )
  }

  @Test
  function testIDREFElementDeserializationFromStringThrowsXmlSimpleValueException() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "IDREF" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child_elem.$Text = \"foo\"",
        "try {",
        "  print( xml.Child )",
        "  fail( \"Expected XmlSimpleValueException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSimpleValueException ) {",
        "  // good",
        "  assertEquals( ex.Message, \"Unresolved IDREF. Attempt to deserialize IDREF outside of parse operation.\" )",
        "}"
    } )
  }

  @Test
  function testIDREFSElementDeserializationFromStringThrowsXmlSimpleValueException() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "IDREFS" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child_elem.$Text = \"foo\"",
        "try {",
        "  print( xml.Child )",
        "  fail( \"Expected XmlSimpleValueException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSimpleValueException ) {",
        "  // good",
        "  assertEquals( ex.Message, \"Unresolved IDREF. Attempt to deserialize IDREF outside of parse operation.\" )",
        "}"
    } )
  }

  @Test
  function testGeneratedIDsAreInCorrectFormat()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.Root = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREF = xml.Root
    xml.IDREFS = { xml }
    assertEquals( "ID", xml.ID )
//    assertNull( xml.NodeID )
    assertEquals( "ID", xml.Root.ID )
//    assertNull( xml.Root.NodeID )
    xml = xml.parse( xml.bytes() )
    assertEquals( "ID", xml.ID )
//    assertEquals( "ID_0", xml.NodeID )
    assertEquals( "ID0", xml.Root.ID )
//    assertEquals( "ID_1", xml.Root.NodeID )
  }

  /*
  function testBadIDREFCausesXSDIDNodeToBeCreated()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREF_elem = new gw.xsd.w3c.xmlschema.types.simple.IDREF()
    xml.IDREF_elem.$Text = "BAD_IDREF"
    try {
      xml = gw.xml.xsd.typeprovider.tst.Root.parse( xml.asUTFString() )
      fail( "Expected Exception" )
    }
    catch( ex : SAXParseException ) {
      // good
      assertThat().string( ex.Message ).contains( "ID/IDREF binding" )
    }
//    assertEquals( gw.xml.xsd.xsdtypes.BrokenIDREF, typeof xml.IDREF )
    assertNull( xml.IDREF )
    assertEquals( "BAD_IDREF", xml.IDREF_elem.$Text )
//    assertEquals( "BAD_IDREF", xml.IDREF.NodeID )
  }

  function testBadIDREFSCausesXSDIDNodesToBeCreated()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.IDREFS_elem = new gw.xsd.w3c.xmlschema.types.simple.IDREFS()
    xml.IDREFS_elem.$Text = "BAD_IDREF1 BAD_IDREF1 BAD_IDREF2 BAD_IDREF3"
    try {
      xml = gw.xml.xsd.typeprovider.tst.Root.parse( xml.asUTFString() )
      fail( "Expected Exception" )
    }
    catch ( ex : SAXParseException ) {
      // good
      assertThat().string( ex.Message ).contains( "ID/IDREF binding" )
    }

    assertEquals( List<XmlElement>, statictypeof xml.IDREFS )
    assertNull( xml.IDREFS )
    assertEquals( 0, xml.IDREFS.Count )
//    assertSame( xml.IDREFS[0], xml.IDREFS[1] )
//    assertEquals( gw.xml.xsd.xsdtypes.BrokenIDREF, typeof xml.IDREFS[1] )
//    assertEquals( "BAD_IDREF1", xml.IDREFS[1].$Text )
////    assertEquals( "BAD_IDREF1", xml.IDREFS[1].NodeID )
//    assertEquals( gw.xml.xsd.xsdtypes.BrokenIDREF, typeof xml.IDREFS[2] )
//    assertEquals( "BAD_IDREF2", xml.IDREFS[2].$Text )
////    assertEquals( "BAD_IDREF2", xml.IDREFS[2].NodeID )
//    assertEquals( gw.xml.xsd.xsdtypes.BrokenIDREF, typeof xml.IDREFS[3] )
//    assertEquals( "BAD_IDREF3", xml.IDREFS[3].$Text )
////    assertEquals( "BAD_IDREF3", xml.IDREFS[3].NodeID )
  }
  */

  @Test
  function testQName()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()

    // completely new namespace with unique prefix, simply gets defined and used
    xml.QNameElem = new QName("foo", "bar", "baz")
    assertTrue( xml.asUTFString().replaceAll( "\"", "'" ).contains( "<QNameElem xmlns:baz='foo'>baz:bar</QNameElem>" ) )

    // namespace of element value asks for prefix ("") already used ON THIS ELEMENT (i.e. by the QNameElem element itself), so gets renamed to ns0
    xml.QNameElem = new QName("foo", "bar")
    assertTrue( xml.asUTFString().replaceAll( "\"", "'" ).contains( "<QNameElem xmlns:ns0='foo'>ns0:bar</QNameElem>" ))

    // namespace matches namespace declaration set on root element, so no ns definition nor prefix needed
    xml.QNameElem = new QName("http://guidewire.com/XSDTypeLoaderTest", "bar")
    assertTrue( xml.asUTFString().replaceAll( "\"", "'" ).contains( "<QNameElem>bar</QNameElem>" ) )
  }

  @Test
  function testPositiveInteger()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.PositiveInteger = 1
    try
    {
      xml.PositiveInteger = 0
      fail("Expected XmlSimpleValueException")
    }
    catch (ex : XmlSimpleValueException)
    {
      // good
    }
  }

  @Test
  function testNonPositiveInteger()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.NonPositiveInteger = 0
    try
    {
      xml.NonPositiveInteger = 1
      fail("Expected XmlSimpleValueException")
    }
    catch (ex : XmlSimpleValueException)
    {
      // good
    }
  }

  @Test
  function testNegativeInteger()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.NegativeInteger = -1
    try
    {
      xml.NegativeInteger = 0
      fail("Expected XmlSimpleValueException")
    }
    catch (ex : XmlSimpleValueException)
    {
      // good
    }
  }

  @Test
  function testNonNegativeInteger()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.NonNegativeInteger = 0
    try
    {
      xml.NonNegativeInteger = -1
      fail("Expected XmlSimpleValueException")
    }
    catch (ex : XmlSimpleValueException)
    {
      // good
    }
  }

  @Test
  function testNMTOKEN()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.NMTOKEN = "foo"
    assertEquals( String, statictypeof xml.NMTOKEN )
    assertEquals( String, typeof xml.NMTOKEN )
    assertEquals( "foo", xml.NMTOKEN )
    xml.NMTOKEN = null // should be ok
    try
    {
      xml.NMTOKEN = ""
      fail( "Expected XmlSimpleValueException" )
    }
    catch ( ex : XmlSimpleValueException )
    {
      // good
    }
    try
    {
      xml.NMTOKEN = "foo bar" // whitespace not allowed
      fail( "Expected XmlSimpleValueException" )
    }
    catch ( ex : XmlSimpleValueException )
    {
      // good
    }
  }

  @Test
  function testNMTOKENS()
  {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    xml.NMTOKENS = { "foo", "bar", "baz" }
    assertEquals( List<String>, statictypeof xml.NMTOKENS )
    assertTrue( xml.NMTOKENS typeis List )
    assertEquals( 3, xml.NMTOKENS.Count )
    assertEquals( "foo", xml.NMTOKENS[0] )
    xml.NMTOKENS = null // should be ok
    xml.NMTOKENS = { } // should be ok
    try
    {
      xml.NMTOKENS = { "foo", null, "baz" }
      fail( "Expected NullPointerException" )
    }
    catch ( ex : NullPointerException )
    {
      // good
    }
    try
    {
      xml.NMTOKENS = { "foo", "bar bar", "baz" } // whitespace not allowed
      fail( "Expected XmlSimpleValueException" )
    }
    catch ( ex : XmlSimpleValueException )
    {
      // good
    }
  }

  /**
   * This method tests usage of a schema-defined type that extends the xsd:QName type.
   */
  @Test
  function testIndirectQName() {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    assertEquals( javax.xml.namespace.QName, statictypeof xml.IndirectQName )
    assertEquals( javax.xml.namespace.QName, statictypeof xml.IndirectQNameAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.QName, statictypeof xml.IndirectQName_elem.$TypeInstance )

    var q = new QName( "foo", "bar", "baz" )
    xml.IndirectQName = q
    xml.IndirectQNameAttr = q
    assertEquals( javax.xml.namespace.QName, typeof xml.IndirectQName )
    assertEquals( javax.xml.namespace.QName, typeof xml.IndirectQNameAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.QName, typeof xml.IndirectQName_elem.$TypeInstance )
    assertEquals( q, xml.IndirectQName )

    xml = xml.parse( xml.asUTFString() )
    assertEquals( javax.xml.namespace.QName, typeof xml.IndirectQName )
    assertEquals( javax.xml.namespace.QName, typeof xml.IndirectQNameAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.QName, typeof xml.IndirectQName_elem.$TypeInstance )
    assertEquals( q, xml.IndirectQName )
  }

  /**
   * This method tests usage of a schema-defined type that extends the xsd:IDREF type.
   */
  @Test
  function testIndirectIDREF() {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    assertEquals( XmlElement, statictypeof xml.IndirectIDREF )
    assertEquals( XmlElement, statictypeof xml.IndirectIDREFAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.IDREF, statictypeof xml.IndirectIDREF_elem.$TypeInstance )

    xml.IndirectIDREF = xml
    xml.IndirectIDREFAttr = xml
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREF )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.IDREF, typeof xml.IndirectIDREF_elem.$TypeInstance )
    assertSame( xml, xml.IndirectIDREF )

    xml = xml.parse( xml.asUTFString() )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREF )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.IDREF, typeof xml.IndirectIDREF_elem.$TypeInstance )
    assertSame( xml, xml.IndirectIDREF )
  }

  /**
   * This method tests usage of a schema-defined type that extends the xsd:IDREF type.
   */
  @Test
  function testIndirectIDREFS() {
    var xml = new gw.xml.xsd.typeprovider.tst.Root()
    assertEquals( List<XmlElement>, statictypeof xml.IndirectIDREFS )
    assertEquals( List<XmlElement>, statictypeof xml.IndirectIDREFSAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.IDREFS, statictypeof xml.IndirectIDREFS_elem.$TypeInstance )

    xml.IndirectIDREFS = { xml, xml, xml }
    xml.IndirectIDREFSAttr = { xml, xml, xml }

    assertEquals( List<XmlElement>, typeof xml.IndirectIDREFS )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFS[0] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFS[1] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFS[2] )
    assertEquals( 3, xml.IndirectIDREFS.Count )

    assertEquals( List<XmlElement>, typeof xml.IndirectIDREFSAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFSAttr[0] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFSAttr[1] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFSAttr[2] )
    assertEquals( 3, xml.IndirectIDREFSAttr.Count )

    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.IDREFS, typeof xml.IndirectIDREFS_elem.$TypeInstance )
    assertSame( xml, xml.IndirectIDREFS[0] )
    assertSame( xml, xml.IndirectIDREFS[1] )
    assertSame( xml, xml.IndirectIDREFS[2] )

    xml = xml.parse( xml.asUTFString() )

    assertEquals( List<XmlElement>, typeof xml.IndirectIDREFS )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFS[0] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFS[1] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFS[2] )
    assertEquals( 3, xml.IndirectIDREFS.Count )

    assertEquals( List<XmlElement>, typeof xml.IndirectIDREFSAttr )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFSAttr[0] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFSAttr[1] )
    assertEquals( gw.xml.xsd.typeprovider.tst.Root, typeof xml.IndirectIDREFSAttr[2] )
    assertEquals( 3, xml.IndirectIDREFSAttr.Count )

    assertEquals( gw.xml.xsd.typeprovider.tst.types.simple.IDREFS, typeof xml.IndirectIDREFS_elem.$TypeInstance )
    assertSame( xml, xml.IndirectIDREFS[0] )
    assertSame( xml, xml.IndirectIDREFS[1] )
    assertSame( xml, xml.IndirectIDREFS[2] )
  }

  @Test
  function testXmlDateTime() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "dateTime" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var date = new java.util.Date()",
        "xml.$Value = new gw.xml.date.XmlDateTime( date.toCalendar(), true )",
        "assertEquals( date, xml.$Value.toCalendar().Time )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( date, xml.$Value.toCalendar().Time )"
    } )
  }

  @Test
  function testXmlDateTypes() {
    var types = {
        "date" -> "XmlDate",
        "dateTime" -> "XmlDateTime",
        "gDay" -> "XmlDay",
        "gMonth" -> "XmlMonth",
        "gMonthDay" -> "XmlMonthDay",
        "time" -> "XmlTime",
        "gYear" -> "XmlYear",
        "gYearMonth" -> "XmlYearMonth"
    }
    var beginningDate = new GregorianCalendar( 1, 0, 1, 0, 0, 0 ).Time.Time
    for ( entry in types.entrySet() ) {
      var t = entry.Key
      var gosuType = "gw.xml.date.${ entry.Value }"
      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.Element[0].Name = "Root"
      schema.Element[0].Type = schema.$Namespace.qualify( t )
      // this tests our parsing and our output of each xsd date type against xerces, for various dates from 1/1/1 until 3/10/3913

      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()",
          "var date = new java.util.Date( ${ beginningDate } )",
          "for ( i in 0..|1000 ) {",
          "  xml.$Value = new ${gosuType}( date.toCalendar(), true )",
          "  xml = xml.parse( xml.bytes() )",
          "  xml.$Value = new ${gosuType}( date.toCalendar(), false )",
          "  xml = xml.parse( xml.bytes() )",
          "  date = new java.util.Date( date.Time + 123456789013 )",
          "}"
      } )
    }
  }

  @Test
  function testLegacyGMonth() {
    // The 2001 version of the specification allowed gMonth in the format --MM--
    // The 2004 version corrected it to work like the other date types, and changed
    // the format to --MM
    // Unfortunately, some tools (JAXB) still generate the original format
    var nonLegacyMonth = new XmlMonth( "--03" )
    var legacyMonth = new XmlMonth( "--03--" )
    assertEquals( nonLegacyMonth, legacyMonth )
    assertEquals( "--03", nonLegacyMonth.toString() )
    assertEquals( "--03", legacyMonth.toString() )

    nonLegacyMonth = new XmlMonth( "--03+02:00" )
    legacyMonth = new XmlMonth( "--03--+02:00" )
    assertEquals( nonLegacyMonth, legacyMonth )
    assertEquals( "--03+02:00", nonLegacyMonth.toString() )
    assertEquals( "--03+02:00", legacyMonth.toString() )

    nonLegacyMonth = new XmlMonth( "--03-02:00" )
    legacyMonth = new XmlMonth( "--03---02:00" )
    assertEquals( nonLegacyMonth, legacyMonth )
    assertEquals( "--03-02:00", nonLegacyMonth.toString() )
    assertEquals( "--03-02:00", legacyMonth.toString() )

    nonLegacyMonth = new XmlMonth( "--03Z" )
    legacyMonth = new XmlMonth( "--03--Z" )
    assertEquals( nonLegacyMonth, legacyMonth )
    assertEquals( "--03Z", nonLegacyMonth.toString() )
    assertEquals( "--03Z", legacyMonth.toString() )

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "gMonth" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root>--03--</root>\" )",
        "assertEquals( new gw.xml.date.XmlMonth( \"--03\" ), xml.$Value )",
        "xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root>--03---02:00</root>\" )",
        "assertEquals( new gw.xml.date.XmlMonth( \"--03-02:00\" ), xml.$Value )"
    } )
  }

  private function assertXmlDateEqualsContract( t : Type<AbstractXmlDateType> )
  {
    for ( i in 0..|1)
    {
      for ( b in 0..|1)
      {
        var o1 = makeXmlDate( t, i == 0, b == 0 )
        var o2 = makeXmlDate( t, i == 0, b == 0 )
        var o3 = makeXmlDate( t, i != 0, b == 0 )
        var o4 = makeXmlDate( t, i == 0, b != 0 )
        var o5 = makeXmlDate( t, i != 0, b != 0 )
        assertEqualsContract( o1, o2 )
        assertEqualsContract( o2, o1 )
        assertNotEqualsContract( o1, o3 )
        assertNotEqualsContract( o1, o4 )
        assertNotEqualsContract( o1, o5 )
      }
    }

  }

  private function assertBad( t : Type<AbstractXmlDateType>, s : String )
  {
    try
    {
      t.TypeInfo.getConstructor( { String } ).Constructor.newInstance( { s } )
      fail( "Expected Exception" )
    }
    catch ( e : Exception )
    {
      // Good
    }
  }

  private function makeXmlDate( t : Type<AbstractXmlDateType>, alt : boolean, includeTimeZone : boolean ) : Object
  {
    var cal = new Date(alt ? 0 as long : 99999999999).toCalendar( TimeZone.GMT )
    var c = t.TypeInfo.getConstructor( { Calendar, boolean } ).Constructor
    return c.newInstance( { cal, includeTimeZone } )
  }

  private function assertEqualsContract( o1 : Object, o2 : Object )
  {
    assertEquals( o1, o2 )
    assertEquals( o2, o1 )
    assertEquals( o1.hashCode(), o2.hashCode() )
  }

  private function assertNotEqualsContract( o1 : Object, o2 : Object )
  {
    assertFalse( o1 + " == " + o2, o1 == o2 )
    assertFalse( o2 + " == " + o1, o2 == o1 )
  }

}
package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses gw.xml.XmlElement
uses gw.xml.XmlParseOptions
uses gw.xsd.w3c.wsdl.Definitions
uses gw.xml.XmlMixedContentText
uses org.junit.Test

class XmlSchemaMixedContentTest extends XSDTest {

  @Test
  function testSimpleMixedContent() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Mixed = true
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var snippet = '<root>  value1  <child>5</child>  value2  </root>'",
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( snippet )",
        "assertEquals( 3, xml.$MixedContent.size() )",
        "assertTrue( xml.asUTFString().contains( snippet ) )"
    } )
  }

  @Test
  function testMixedContentIsDiscardedIfNotMixed() {
    var xml = XmlElement.parse( "<root>  value1  <child>5</child>  value2  </root>" )
    assertTrue(xml.asUTFString().contains("<root>\n  <child>5</child>\n</root>"))
  }

  @Test
  function testMixedContentIsNotDiscardedWithinUnrecognizedElement() {
    // note that the WSDL schema IS NOT included when parsing
    var snippet = '<xs:documentation>  value1  <wsdl:definitions>      <wsdl:types>  </wsdl:types></wsdl:definitions>  value2  </xs:documentation>'
    var xml = Schema.parse(
        "<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema' xmlns:wsdl='http://schemas.xmlsoap.org/wsdl/'>\n" +
            "  <xs:annotation>\n" +
            "    ${snippet}\n" +
            "  </xs:annotation>\n" +
            "</xs:schema>"
    )
    assertEquals( XmlElement, typeof xml.Annotation[0].Documentation[0].$Children[0] )
    assertEquals( 3, xml.Annotation[0].Documentation[0].$MixedContent.size() )
    assertTrue(xml.asUTFString().contains(snippet))
  }

  @Test
  function testMixedContentIsDiscardedWithinRecognizedNonMixedElementEmbeddedInMixedElement() {
    // note that the WSDL schema IS included when parsing
    var snippet = '<xs:documentation>  value1  <wsdl:definitions>      <wsdl:types>  </wsdl:types>     </wsdl:definitions>  value2  </xs:documentation>'
    var expected = '<xs:documentation>  value1  <wsdl:definitions><wsdl:types/></wsdl:definitions>  value2  </xs:documentation>'
    var xml = Schema.parse(
        "<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema' xmlns:wsdl='http://schemas.xmlsoap.org/wsdl/'>\n" +
            "  <xs:annotation>\n" +
            "    ${snippet}\n" +
            "  </xs:annotation>\n" +
            "</xs:schema>", new XmlParseOptions() { : AdditionalSchemas = { gw.xsd.w3c.wsdl.util.SchemaAccess } }
    )
    var definitionsElement = xml.Annotation[0].Documentation[0].$Children[0]
    assertEquals( Definitions, typeof definitionsElement ) // ensure element is recognized
    assertEquals(1, definitionsElement.MixedContent.size())
    assertTrue(xml.asUTFString().contains(expected))
  }

  @Test
  function testMixedContentIsDiscardedFromXmlElement() {
    var mixedContentText = "mixed content"
    var xml = XmlElement.parse( "<root> ${mixedContentText} <child/> ${mixedContentText} </root>" )
    assertEquals( "", xml.Text )
    assertNull( xml.SimpleValue )
    assertEquals(1, xml.MixedContent.size())
    assertEquals( XmlElement, typeof xml.MixedContent[0] )
    assertFalse(xml.asUTFString().contains(mixedContentText))
  }

  @Test
  function testMixedContentCanBeAddedToXmlElementButWillNotSerialize() {
    var mixedContentText = "mixed content"
    var xml = new XmlElement( "root" )
    xml.MixedContent.add( new XmlMixedContentText( mixedContentText ) )
    xml.MixedContent.add( new XmlElement( "child" ) )
    xml.MixedContent.add( new XmlMixedContentText( mixedContentText ) )
    assertFalse(xml.asUTFString().contains(mixedContentText))
    xml = xml.parse( xml.bytes() )
    assertEquals(1, xml.MixedContent.size())
  }

  @Test
  function testMixedContentCanBeAddedToNonMixedElementButWillNotSerialize() {
    var mixedContentText = "mixed content"
    var xml = new Definitions()
    xml.$MixedContent.add( new XmlMixedContentText( mixedContentText ) )
    assertFalse(xml.asUTFString().contains(mixedContentText))
    xml = xml.parse( xml.bytes() )
    assertTrue(xml.$MixedContent.isEmpty())
  }

  @Test
  function testProgrammaticCreationOfSchemaDocumentation() {
    var mixedContentText = "   mixed content   "
    var schema = new Schema()
    schema.Annotation[0].Documentation[0].$MixedContent[0] = new XmlMixedContentText( mixedContentText )
    schema.Annotation[0].Documentation[0].$MixedContent[1] = new Definitions()
    schema.Annotation[0].Documentation[0].$MixedContent[2] = new XmlMixedContentText( mixedContentText )
    schema = schema.parse( schema.bytes() )
    assertEquals( mixedContentText, ( schema.Annotation[0].Documentation[0].$MixedContent[0] as XmlMixedContentText ).Text )
    assertEquals( XmlElement, typeof schema.Annotation[0].Documentation[0].$MixedContent[1] )
    assertEquals( "definitions", ( schema.Annotation[0].Documentation[0].$MixedContent[1] as XmlElement ).QName.LocalPart )
    assertEquals( mixedContentText, ( schema.Annotation[0].Documentation[0].$MixedContent[2] as XmlMixedContentText ).Text )
  }

  @Test
  function testMixedContentIsNotSplitUp_JiraPL16593() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Mixed = true
    schema.Element[0].ComplexType.Sequence.Element[0] = new() {
        :Name = "child",
        :Type = schema.$Namespace.qualify( "string" )
        }
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( '<root>  mixed content 1  <child>  value  </child>  mixed content 2  </root>' )",
        "for ( part in xml.$MixedContent ) {",
        "  print( typeof part + ': <' + part + '>' )",
        "}",
        "assertEquals( 3, xml.$MixedContent.Count )",
        "assertEquals( '  mixed content 1  ', ( xml.$MixedContent[0] as gw.xml.XmlMixedContentText ).Text )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.$MixedContent[1] )",
        "assertEquals( '  mixed content 2  ', ( xml.$MixedContent[2] as gw.xml.XmlMixedContentText ).Text )"
    } )
  }

  @Test
  function testMixedContentList_SubstitutionGroupList_AddWithIndex() {
    var expected = new Schema()
    expected.Element[0] = new() { :Name = "foo" }
    var actual = new Schema()
    actual.Element.add( actual.Element.Count, new() { :Name = "foo" } )
    assertXmlEquals( actual, expected )
    actual = actual.parse( actual.bytes() )
    assertXmlEquals( actual, expected )
  }

  @Test
  function testMixedContentList_SubstitutionGroupList_AddWithIndex_AIOException() {

    var expected = new Schema()
    expected.Element[0] = new() { :Name = "fee" }
    expected.Element[1] = new() { :Name = "foo" }
    expected.Element[2] = new() { :Name = "fum" }
    var actual = new Schema()
    actual.Element.add( actual.Element.Count, new() { :Name = "foo" } )
    actual.Element.add( 0, new() { :Name = "fee" } )
    actual.Element.add( actual.Element.Count, new() { :Name = "fum" } )
    assertXmlEquals( actual, expected )
    actual = actual.parse( actual.bytes() )
    assertXmlEquals( actual, expected )
  }
}
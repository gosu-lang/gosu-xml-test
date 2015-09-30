package gw.xml.xsd.typeprovider

uses java.math.BigDecimal
uses gw.xml.XmlSimpleValueException
uses java.lang.Integer
uses javax.xml.XMLConstants
uses gw.xml.XmlElement
uses java.lang.IllegalArgumentException
uses java.net.URI
uses javax.xml.namespace.QName
uses gw.xml.XmlException
uses java.lang.RuntimeException
uses gw.xsd.w3c.xmlschema.Schema
uses gw.xsd.w3c.xmlschema.Element
uses gw.xml.XmlSerializationOptions
uses gw.xml.XmlSortException
uses org.junit.Ignore
uses org.junit.Test


class XmlSchemaRuntimeTest extends XSDTest {

  @Test
  function testSettingAttributeCreatesAttribute() {
    assertNotNull( gw.xsd.w3c.xmlschema.Schema.Type.TypeInfo.getProperty( "TargetNamespace" ) )
    assertNull( gw.xsd.w3c.xmlschema.Schema.Type.TypeInfo.getProperty( "TargetNamespace_elem" ) )

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "ElementOfComplexTypeWithSimpleContent"
    schema.Element[0].ComplexType.SimpleContent.Extension.Base = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.SimpleContent.Extension.Attribute[0].Name = "ByteAttr"
    schema.Element[0].ComplexType.SimpleContent.Extension.Attribute[0].Type = schema.$Namespace.qualify( "byte" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var x = new $$TESTPACKAGE$$.schema.ElementOfComplexTypeWithSimpleContent()",
        "x.ByteAttr = 42",
        "assertEquals( 1, x.$AttributeNames.Count )",
        "var attr = x.getAttributeSimpleValue( $$TESTPACKAGE$$.schema.ElementOfComplexTypeWithSimpleContent.$ATTRIBUTE_QNAME_ByteAttr )",
        "assertNotNull( attr )",
        "assertEquals( \"42\", attr.StringValue )",
        "assertEquals( 42 as java.lang.Byte, attr.GosuValue )",
        "assertEquals( java.lang.Byte, attr.GosuValueType )",
        "assertEquals( new javax.xml.namespace.QName( \"ByteAttr\" ), $$TESTPACKAGE$$.schema.ElementOfComplexTypeWithSimpleContent.$ATTRIBUTE_QNAME_ByteAttr )"
    } )
  }

  @Test
  function testSettingElementPropertyCreatesChildElement() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "ElementThatContainsChildElement"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "ChildElement"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.ElementThatContainsChildElement()",
        "xml.ChildElement = 42",
        "assertEquals( 1, xml.$Children.Count )",
        "var child = xml.getChild( $$TESTPACKAGE$$.schema.ElementThatContainsChildElement.$ELEMENT_QNAME_ChildElement ) ",
        "assertNotNull( child )",
        "assertEquals( \"42\", child.SimpleValue.StringValue )",
        "assertEquals( 42, child.SimpleValue.GosuValue )",
        "assertEquals( java.lang.Integer, child.SimpleValue.GosuValueType )",
        "assertEquals( new javax.xml.namespace.QName( \"ChildElement\" ), $$TESTPACKAGE$$.schema.ElementThatContainsChildElement.$ELEMENT_QNAME_ChildElement )"
    })
  }

  @Test
  function testAttributeDefaultValue() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "attr"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Attribute[0].Default = "5"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( 5, xml.Attr )",
        "assertFalse( xml.asUTFString().contains( \"5\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Attr )",
        "assertFalse( xml.asUTFString().contains( \"5\" ) )",
        "xml.Attr = 5",
        "assertEquals( 5, xml.Attr )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Attr )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )"
    } )
  }

  @Test
  function testAttributeFixedValue() {
    // fixed attributes are handled exactly like default attributes for now
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "attr"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Attribute[0].Fixed = "5"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( 5, xml.Attr )",
        "assertFalse( xml.asUTFString().contains( \"5\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Attr )",
        "assertFalse( xml.asUTFString().contains( \"5\" ) )",
        "xml.Attr = 5",
        "assertEquals( 5, xml.Attr )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Attr )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )"
    } )
  }

  @Test
  function testElementDefaultValue() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].Default = "5"

    schema.Element[1].Name = "Root2"
    schema.Element[1].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[1].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[1].ComplexType.Sequence.Element[0].Default = "5"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertNull( xml.$Value )",
        "assertEquals( '', xml.$Text )",
        "assertFalse( xml.asUTFString().contains( \"5\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.$Value )",
        "assertEquals( \"5\", xml.$Text )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "xml.$Value = 5",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "assertEquals( \"5\", xml.$Text )",
        "xml = xml.parse( xml.bytes() )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "assertEquals( \"5\", xml.$Text )",
        "var xml2 = new $$TESTPACKAGE$$.schema.Root2()",
        "assertNull( xml2.Child )",
        "assertNull( xml2.Child_elem )",
        "var childElem = new $$TESTPACKAGE$$.schema.anonymous.elements.Root2_Child()",
        "assertNull( childElem.$Value )",
        "assertEquals( '', childElem.$Text )",
        "xml2.Child_elem = childElem",
        "assertNull( xml2.Child )",
        "assertNull( xml2.Child_elem.$Value )",
        "assertEquals( '', xml2.Child_elem.$Text )",
        "assertFalse( xml2.asUTFString().contains( \"5\" ) )",
        "xml2 = xml2.parse( xml2.bytes() )",
        "assertEquals( 5, xml2.Child )",
        "assertEquals( 5, xml2.Child_elem.$Value )",
        "assertEquals( \"5\", xml2.Child_elem.$Text )",
        "assertTrue( xml2.asUTFString().contains( \"5\" ) )"
    } )
  }

  @Test
  function testElementFixedValue() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()

    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].Fixed = "5"

    schema.Element[1].Name = "Root2"
    schema.Element[1].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[1].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[1].ComplexType.Sequence.Element[0].Fixed = "5"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertNull( xml.$Value )",
        "assertEquals( '', xml.$Text )",
        "assertFalse( xml.asUTFString().contains( \"5\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.$Value )",
        "assertEquals( \"5\", xml.$Text )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "xml.$Value = 5",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "assertEquals( \"5\", xml.$Text )",
        "xml = xml.parse( xml.bytes() )",
        "assertTrue( xml.asUTFString().contains( \"5\" ) )",
        "assertEquals( \"5\", xml.$Text )",
        "var xml2 = new $$TESTPACKAGE$$.schema.Root2()",
        "assertNull( xml2.Child )",
        "assertNull( xml2.Child_elem )",
        "var childElem = new $$TESTPACKAGE$$.schema.anonymous.elements.Root2_Child()",
        "assertNull( childElem.$Value )",
        "assertEquals( '', childElem.$Text )",
        "xml2.Child_elem = childElem",
        "assertNull( xml2.Child )",
        "assertNull( xml2.Child_elem.$Value )",
        "assertEquals( '', xml2.Child_elem.$Text )",
        "assertFalse( xml2.asUTFString().contains( \"5\" ) )",
        "xml2 = xml2.parse( xml2.bytes() )",
        "assertEquals( 5, xml2.Child )",
        "assertEquals( 5, xml2.Child_elem.$Value )",
        "assertEquals( \"5\", xml2.Child_elem.$Text )",
        "assertTrue( xml2.asUTFString().contains( \"5\" ) )"
    } )
  }

  @Test
  function testIDREF() {
    var elementWithID = new gw.xml.xsd.typeprovider.test.ElementWithID()
    var elementWithoutID = new gw.xml.xsd.typeprovider.test.ElementWithoutID()
    assertNull( elementWithID.Id )
    assertNull( elementWithID.Ref )
    assertXmlSimpleValueException( \ ->{ elementWithID.Ref = new XmlElement( "Foo" ) } ) // does not have ID
    assertXmlSimpleValueException( \ ->{ elementWithID.Ref = elementWithoutID } ) // does not have ID
    assertNull( elementWithID.Id ) // ID should not have been assigned due to invalid reference
    assertNull( elementWithID.Ref )
    elementWithID.Ref = elementWithID // should pass
    assertEquals( "ID", elementWithID.Id ) // Basic ID of "ID" should have been assigned to simpletype's stringvalue
    assertSame( elementWithID, elementWithID.Ref )
    elementWithID = elementWithID.parse( elementWithID.bytes() )
    assertEquals( "ID", elementWithID.Id ) // Basic ID of "ID" should have been assigned to simpletype's stringvalue
    assertSame( elementWithID, elementWithID.Ref )
    // now attempt to assign an idref, but not include the actual element in the output document
    elementWithID.Ref = new gw.xml.xsd.typeprovider.test.ElementWithID()
    try {
      elementWithID.print()
      fail( "Expected XmlParseException" )
    }
    catch ( ex : XmlException ) {
      // good
    }
    try {
      elementWithID.parse( elementWithID.bytes() )
      fail( "Expected exception" )
    }
    catch ( ex ) {
      // good
    }
  }

  @Test
  function testFourWayBoolean() {
    // XmlSchema allows a boolean to be represented as true, false, 1, or 0
    var xml = new gw.xml.xsd.typeprovider.test.Boolean()
    xml.$Value = true
    assertEquals( "true", xml.$SimpleValue.StringValue )
    xml.$Value = false
    assertEquals( "false", xml.$SimpleValue.StringValue )
  }

  @Test
  function testAssigningToSimplePropertyChangesSimpleValuePropertyAndViceVersa() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()
    xml.FractionDigits2 = 42
    assertEquals( 42 as BigDecimal, xml.FractionDigits2 )
    assertEquals( 42 as BigDecimal, xml.FractionDigits2_elem.$Value )

    xml.FractionDigits2_elem.$Value = 24
    assertEquals( 24 as BigDecimal, xml.FractionDigits2 )
    assertEquals( 24 as BigDecimal, xml.FractionDigits2_elem.$Value )
  }

  @Test
  function testSettingValuePropertyToNullDoesntThrowXmlSimpleValueException() {
    var xml = new gw.xml.xsd.typeprovider.test.FacetTest()
    xml.FractionDigits2 = 42
    assertEquals( 42, xml.FractionDigits2 as int )
    assertEquals( 42, xml.FractionDigits2_elem.$Value as int )
    xml.FractionDigits2 = null
    assertNull( xml.FractionDigits2 )
    assertNull( xml.FractionDigits2_elem.$Value )
    xml.FractionDigits2_elem.$Value = 42
    assertEquals( 42, xml.FractionDigits2 as int )
    assertEquals( 42, xml.FractionDigits2_elem.$Value as int )
    xml.FractionDigits2_elem.$Value = null
    assertNull( xml.FractionDigits2 )
    assertNull( xml.FractionDigits2_elem.$Value )
  }

  @Test
  function testXmlSchemaSimpleTypeListAutocreateAndAutoinsert() {
    var xml = new gw.xml.xsd.typeprovider.test.ElementOfListType()
    // the following statement relies on both the @Autocreate and the @Autoinsert annotation. Autocreate happens first, assigning a new empty ArrayList to the property.
    // Autoinsert happens next, inserting 0 into the list
    xml.$Value[0] = 0;
    xml.$Value[1] = 1;
    xml.$Value[2] = 2;
    assertEquals( List<Integer>, statictypeof xml.$Value )
    assertEquals( List<Integer>, typeof xml.$Value )
    assertEquals(3, xml.$Value.size())
    assertEquals( 0, xml.$Value[0] )
    assertEquals( 1, xml.$Value[1] )
    assertEquals( 2, xml.$Value[2] )
    assertEquals( "0 1 2", xml.$Text )
  }

  @Test
  function testMinOccursMaxOccurs() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[0].MinOccurs = 2
    schema.Element[0].ComplexType.Sequence.Element[0].MaxOccurs = "3"

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertExceptionThrown( \\ -> xml.parse( xml.bytes() ), gw.xml.XmlSortException )",
        "xml.Child[0] = 0",
        "assertExceptionThrown( \\ -> xml.parse( xml.bytes() ), gw.xml.XmlSortException )",
        "xml.Child[1] = 1",
        "xml.parse( xml.bytes() )",
        "xml.Child[2] = 2",
        "xml.parse( xml.bytes() )",
        "xml.Child[3] = 3",
        "assertExceptionThrown( \\ -> xml.parse( xml.bytes() ), gw.xml.XmlSortException )"
    })
  }

  @Test
  function testQNamePrefixForElementsMatchesSchema() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    assertEquals( "xs", schema.$QName.Prefix )
    assertTrue(schema.asUTFString().contains("<xs:schema"))
    var xml = new gw.xml.xsd.typeprovider.test.ElementSimpleType()
    xml.$Value = 5
    assertEquals( XMLConstants.DEFAULT_NS_PREFIX, xml.$QName.Prefix )
    assertTrue(xml.asUTFString().contains("<ElementSimpleType"))
  }

  @Test
  function testParsedXmlElementsDoNotTrimWhitespace() {
    var xml = XmlElement.parse( "<foo>   abc   def   </foo>" )
    assertEquals( "   abc   def   ", xml.Text )
  }

  @Test
  function testParsedXmlElementsRetainOnlyWhitespace() {
    var xml = XmlElement.parse( "<foo>          </foo>" )
    assertEquals( "          ", xml.Text )
  }

  @Test
  function testGeneratedXMLContainsNamespaceDeclaration() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com/XSDTypeLoaderTest" )
    schema.Element[0].Name = "Root"
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var qName = xml.$QName",
        "assertEquals( 'http://guidewire.com/XSDTypeLoaderTest', qName.NamespaceURI )",
        "assertEquals( 'Root', qName.LocalPart )",
        "assertEquals( 0, xml.$AttributeNames.size() )",
        "assertThat().string(xml.asUTFString()).contains( '<Root xmlns=\"http://guidewire.com/XSDTypeLoaderTest\"/>' )"
    } )
  }


  // A one-off test to do a sanity check on default attribute values
  @Test
  function testElementFormDefaultIsSetToUnqualifiedByDefault() {
    var xsd = new gw.xsd.w3c.xmlschema.Schema()
    assertTrue( xsd.ElementFormDefault == Unqualified )
    xsd = xsd.parse( xsd.bytes() )
    assertTrue( xsd.ElementFormDefault == Unqualified )
    assertFalse( xsd.asUTFString().toLowerCase().contains("unqualified" ) )
    xsd = xsd.parse( xsd.asUTFString() )
    assertTrue( xsd.ElementFormDefault == Unqualified )
  }

  @Test
  function testSendingNullTypeInstanceToXmlElementConstructorCreatesDefaultTypeInstance() {
    var schema = new gw.xsd.w3c.xmlschema.Schema( null )
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.types.complex.Schema, statictypeof schema.$TypeInstance )
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.types.complex.Schema, typeof schema.$TypeInstance )
  }

  @Test
  function testSettingTypeInstanceToNullThrowsIllegalArgumentException() {
    try {
      var schema = new gw.xsd.w3c.xmlschema.Schema()
      schema.$TypeInstance = null
      fail( "Expected IllegalArgumentException" )
    }
    catch ( ex : IllegalArgumentException ) {
      // good
    }
  }

  @Test
  function testXsdListElementDefaultValue() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].Default = "1 2 3"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertNull( xml.Child )",
        "assertNull( xml.Child_elem )",
        "xml.Child_elem = new $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child()",
        "assertNull( xml.Child )",
        "assertNull( xml.Child_elem.$Value )",
        "xml = xml.parse( xml.bytes() )",
        "assertThat().list( xml.Child ).isEqualTo( { 1, 2, 3 } )",
        "assertThat().list( xml.Child_elem.$Value ).isEqualTo( { 1, 2, 3 } )"
    } )
  }

  @Test
  function testXsdListAttributeDefaultValue() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].Default = "1 2 3"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertThat().list( xml.Attr ).isEqualTo( { 1, 2, 3 } )",
        "xml = xml.parse( xml.bytes() )",
        "assertThat().list( xml.Attr ).isEqualTo( { 1, 2, 3 } )"
    } )
  }

  @Test
  function testPluralXsdListElementDefaultValue() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Element[0].Default = "1 2 3"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertEquals( 0, xml.Child.Count )",
        "assertEquals( 0, xml.Child_elem.Count )",
        "xml.Child_elem[0] = new $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child()",
        "assertEquals( 1, xml.Child.Count )",
        "assertEquals( 1, xml.Child_elem.Count )",
        "assertNull( xml.Child[0] )",
        "assertNull( xml.Child_elem[0].$Value )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 1, xml.Child.Count )",
        "assertEquals( 1, xml.Child_elem.Count )",
        "assertThat().list( xml.Child[0] ).isEqualTo( { 1, 2, 3 } )",
        "assertThat().list( xml.Child_elem[0].$Value ).isEqualTo( { 1, 2, 3 } )"
    } )
  }

  @Test
  function testXsdListAttributeDefaultValueIsUnmodifiable() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].Default = "1 2 3"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "try {",
        "  xml.Attr[0] = 1",
        "  fail( \"Expected UnsupportedOperationException\" )",
        "}",
        "catch ( ex : java.lang.UnsupportedOperationException ) {",
        "  // good",
        "}"
    } )
  }

  @Test
  function testXsdListDefaultValueIsModifiableOnceSet() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].Default = "1 2 3"
    schema.Element[0].ComplexType.Sequence.Element[0].SimpleType.List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "assertNull( xml.Child )", // default only holds if the element actually exists
        "assertNull( xml.Child_elem )",
        "xml.Child_elem = new $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child()",
        "xml.Child_elem.$Value = {}",
        "xml.Child[0] = 5",
        "assertEquals( 5, xml.Child[0] )",
        "assertEquals( 5, xml.Child_elem.$Value[0] )",
        "xml.Child_elem.$Value[0] = 6",
        "assertEquals( 6, xml.Child[0] )",
        "assertEquals( 6, xml.Child_elem.$Value[0] )"
    } )
  }

  @Test
  function testXsdAnyWithNamespaceSpecification_TargetNamespace() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com" )
    schema.Import[0].Namespace = new URI( "urn:other" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Any[0].Namespace = gw.xsd.w3c.xmlschema.enums.NamespaceList2.TargetNamespace.SerializedValue
    schema.Element[1].Name = "MyElement"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:other" )
    schema2.Element[0].Name = "MyElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema.MyElement() )",
        "xml.print()",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema2.MyElement() )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  ex.printStackTrace()",
        "  assertThat().string( ex.Cause.Message ).contains( \"##targetNamespace\" )",
        "  assertThat().string( ex.Cause.Message ).contains( \"http://guidewire.com\" )",
        "}"
    } )
  }

  @Test
  function testXsdAnyWithNamespaceSpecification_Other() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com" )
    schema.Import[0].Namespace = new URI( "urn:other" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Any[0].Namespace = gw.xsd.w3c.xmlschema.enums.NamespaceList.Other.SerializedValue
    schema.Element[1].Name = "MyElement"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:other" )
    schema2.Element[0].Name = "MyElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema.MyElement() )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"##other\" )",
        "  assertThat().string( ex.Cause.Message ).contains( \"http://guidewire.com\" )",
        "}",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema2.MyElement() )",
        "xml.print()"
    } )
  }

  @Test
  function testXsdAnyWithNamespaceSpecification_Any() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com" )
    schema.Import[0].Namespace = new URI( "urn:other" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Any[0].Namespace = gw.xsd.w3c.xmlschema.enums.NamespaceList.Any.SerializedValue
    schema.Element[1].Name = "MyElement"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:other" )
    schema2.Element[0].Name = "MyElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema.MyElement() )",
        "xml.print()",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema2.MyElement() )",
        "xml.print()"
    } )
  }

  // default is ##any
  @Test
  function testXsdAnyWithNamespaceSpecification_Default() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com" )
    schema.Import[0].Namespace = new URI( "urn:other" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[1].Name = "MyElement"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:other" )
    schema2.Element[0].Name = "MyElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema.MyElement() )",
        "xml.print()",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema2.MyElement() )",
        "xml.print()"
    } )
  }

  @Test
  function testXsdAnyWithNamespaceSpecification_Local() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com" )
    schema.Import[0].Namespace = new URI( "urn:other" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[1].SchemaLocation = new URI( "schema3.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Any[0].Namespace = gw.xsd.w3c.xmlschema.enums.NamespaceList2.Local.SerializedValue
    schema.Element[1].Name = "MyElement"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:other" )
    schema2.Element[0].Name = "MyElement"

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.Element[0].Name = "LocalElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema.MyElement() )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"##local\" )",
        "  assertThat().string( ex.Cause.Message ).contains( \"http://guidewire.com\" )",
        "}",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema2.MyElement() )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"##local\" )",
        "  assertThat().string( ex.Cause.Message ).contains( \"http://guidewire.com\" )",
        "}",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema3.LocalElement() )",
        "xml.print()"
    } )
  }

  @Test
  function testXsdAnyWithNamespaceSpecification_EmptyList() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com" )
    schema.Import[0].Namespace = new URI( "urn:other" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[1].SchemaLocation = new URI( "schema3.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Any[0].Namespace = ""
    schema.Element[1].Name = "MyElement"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:other" )
    schema2.Element[0].Name = "MyElement"

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.Element[0].Name = "LocalElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema.MyElement() )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"http://guidewire.com\" )",
        "}",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema2.MyElement() )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"http://guidewire.com\" )",
        "}",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new gw.xml.XmlElement( \"LocalElement\" ) )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"http://guidewire.com\" )",
        "}"
    } )
  }

  @Test
  function testXsdAnyWithNamespaceSpecification_ExplicitList() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "http://guidewire.com" )
    schema.Import[0].Namespace = new URI( "urn:other" )
    schema.Import[0].SchemaLocation = new URI( "schema2.xsd" )
    schema.Import[1].SchemaLocation = new URI( "schema3.xsd" )
    schema.Import[2].Namespace = new URI( "urn:notallowed" )
    schema.Import[2].SchemaLocation = new URI( "schema4.xsd" )
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Any[0].Namespace = gw.xsd.w3c.xmlschema.enums.NamespaceList2.Local.SerializedValue + " http://guidewire.com urn:other"
    schema.Element[1].Name = "MyElement"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.TargetNamespace = new URI( "urn:other" )
    schema2.Element[0].Name = "MyElement"

    var schema3 = new gw.xsd.w3c.xmlschema.Schema()
    schema3.Element[0].Name = "LocalElement"

    var schema4 = new gw.xsd.w3c.xmlschema.Schema()
    schema4.TargetNamespace = new URI( "urn:notallowed" )
    schema4.Element[0].Name = "MyElement"

    XmlSchemaTestUtil.runWithResources( { schema, schema2, schema3, schema4 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema.MyElement() )",
        "xml.print()",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema2.MyElement() )",
        "xml.print()",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new gw.xml.XmlElement( \"LocalElement\" ) )",
        "xml.print()",
        "xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.addChild( new $$TESTPACKAGE$$.schema4.MyElement() )",
        "try {",
        "  xml.print()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"urn:other\" )",
        "}"
    } )
  }

  @Test
  function testChildrenPropertyAutoInsert() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Any[0].ProcessContents = Lax

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Children[0] = new gw.xml.XmlElement( \"Blah\" )", // autoinsert
        "assertEquals( gw.xml.XmlElement, typeof xml.$Children[0] )",
        "assertEquals( new javax.xml.namespace.QName( \"Blah\" ), xml.$Children[0].QName )",
        "assertThat().string( xml.asUTFString().contains( \"Blah\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( gw.xml.XmlElement, typeof xml.$Children[0] )",
        "assertEquals( new javax.xml.namespace.QName( \"Blah\" ), xml.$Children[0].QName )",
        "assertThat().string( xml.asUTFString().contains( \"Blah\" ) )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( gw.xml.XmlElement, typeof xml.$Children[0] )",
        "assertEquals( new javax.xml.namespace.QName( \"Blah\" ), xml.$Children[0].QName )",
        "assertThat().string( xml.asUTFString().contains( \"Blah\" ) )"
    } )
  }

  @Test
  function testAttributeWithNamespaceUriDoesNotUseDefaultNsPrefix() {
    var xml = new XmlElement( new QName( "urn:foo", "Foo" ) )
    xml.setAttributeValue( new QName( "urn:foo", "attr" ), "value" )
    xml = xml.parse( xml.bytes() )
    assertEquals( "urn:foo", xml.AttributeNames.iterator().next().NamespaceURI )
  }

  @Test
  function testAttributeNameIsEnforcedAsNCName() {
    var xml = new XmlElement( "Foo" )
    xml.setAttributeValue( "abc", "def" )
    try {
      xml.setAttributeValue( "foo:bar", "baz" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
    }
    xml.setAttributeValue( "a-bc", "def" )
    try {
      xml.setAttributeValue( "-abc", "def" ) // invalid start character
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
    }
  }

  @Test
  function testXmlnsAttributesCannotBeSetExplicitly() {
    var xml = new XmlElement( "Foo" )
    xml.setAttributeValue( "foo", "urn:foo" )
    try {
      xml.setAttributeValue( "xmlns", "urn:foo" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
    }
    try {
      xml.setAttributeValue( "xmlns:foo", "urn:foo" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
    }
    try {
      xml.setAttributeValue( new QName( XMLConstants.XMLNS_ATTRIBUTE_NS_URI, "foo", XMLConstants.XMLNS_ATTRIBUTE), "urn:foo" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
    }
    try {
      xml.setAttributeValue( new QName( XMLConstants.XMLNS_ATTRIBUTE_NS_URI, "foo", "blah"), "urn:foo" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
    }
  }

  @Test
  function testSimpleValueDoesNotNeedToBeSetIfEmptyStringIsLegal() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.print()"
    } )
  }

  @Test
  function testCommentsAreStrippedFromParsedSimpleValues() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "StringElement"
    schema.Element[0].Type = schema.$Namespace.qualify( "string" )
    schema.Element[1].Name = "IntElement"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.StringElement.parse( \"<StringElement> <!--comment--> test<!--comment--></StringElement>\" )",
        "assertEquals( \"  test\", xml.$Value )",
        "assertEquals( 0, xml.$Children.Count )",
        "var xml2 = $$TESTPACKAGE$$.schema.IntElement.parse( \"<IntElement> <!--comment--> 123<!--comment-->456<!--comment--></IntElement>\" )",
        "assertEquals( 123456, xml2.$Value )",
        "assertEquals( \"123456\", xml2.$Text )"
    } )
  }

  @Test
  function testCommentsAreStrippedFromParsedComplexElements() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "Child"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>       <!--comment--> <Child>123456</Child>       </Root>\" )",
        "assertEquals( 123456, xml.Child )",
        "assertEquals( 1, xml.$Children.Count )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child, typeof xml.$Children[0] )"
    } )
  }

  @Test
  function testParseOfStringWithLessThanSignThrowsXmlException() {
    try {
      XmlElement.parse( "<foo>" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertFalse(ex.Message.contains("java.io.File"))
    }
  }

  @Test
  function testParseOfStringWithoutLessThanSignThrowsXmlException() {
    try {
      XmlElement.parse( "foo" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertTrue(ex.Message.contains("java.io.File"))
    }
  }

  @Test
  function testUserDefinedNamespaceCannotBeAssignedToEmptyPrefixIfEmptyPrefixIsAlreadyInUseByNullNamespace() {
    var xml = new XmlElement( "root" )
    xml.declareNamespace( new URI( "asdf" ), "" )
    assertTrue(xml.asUTFString().contains("xmlns:ns0=\"asdf\""))
    xml = XmlElement.parse( xml.bytes() )
  }

  @Test
  function testUserDefinedNamespaceTakesPrecendenceOverNamespacePrefixAlreadyInUseByAnElementQName() {
    var xml = new XmlElement( new QName( "urn:foo", "root" ) )
    xml.declareNamespace( new URI( "asdf" ), "" )
    assertTrue(xml.asUTFString().contains("xmlns=\"asdf\""))
    assertTrue(xml.asUTFString().contains("xmlns:ns0=\"urn:foo\""))
    xml = XmlElement.parse( xml.bytes() )
  }

  @Test
  function testSubstitutionGroupListCanContainMultipleInstancesOfTheSameElement() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "B"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Name = "A"
    schema.Element[0].ComplexType.Sequence.Sequence[0].Element[0].Type = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "var a = new $$TESTPACKAGE$$.schema.anonymous.elements.Root_A()",
        "a.$Value = 10",
        "xml.B = 5",
        "xml.A_elem = { a, a }",
        "assertEquals( 3, xml.$Children.Count )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 3, xml.$Children.Count )"
    } )
  }

  @Test
  function testTextProperty() {
    var xml = XmlElement.parse( "<root/>" )
    assertEquals( "", xml.Text )
    xml = XmlElement.parse( "<root></root>" )
    assertEquals( "", xml.Text )
    xml = XmlElement.parse( "<root> </root>" )
    assertEquals( " ", xml.Text )
    xml = XmlElement.parse( "<root> foo </root>" )
    assertEquals( " foo ", xml.Text )
    xml = XmlElement.parse( "<root>  foo  bar  </root>" )
    assertEquals( "  foo  bar  ", xml.Text )
    xml = XmlElement.parse( "<root><!--comment-->  foo  b<!--comment-->ar<!--comment-->  </root>" )
    assertEquals( "  foo  bar  ", xml.Text )
  }

  @Test
  function testTextPropertyWithSchema() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root/>\" )",
        "assertEquals( \"\", xml.$Text )",
        "xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root></root>\" )",
        "assertEquals( \"\", xml.$Text )",
        "xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root> </root>\" )",
        "assertEquals( \" \", xml.$Text )",
        "xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root> foo </root>\" )",
        "assertEquals( \" foo \", xml.$Text )",
        "xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root>  foo  bar  </root>\" )",
        "assertEquals( \"  foo  bar  \", xml.$Text )",
        "xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root><!--comment-->  foo  b<!--comment-->ar<!--comment-->  </root>\" )",
        "assertEquals( \"  foo  bar  \", xml.$Text )"
    } )
  }

  @Test
  function testUniqueParticleAttributionIsHonored() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[0].Name = "A"
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[0].MinOccurs = 0
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[1].Name = "B"
    schema.Element[0].ComplexType.Choice.Sequence[0].Element[1].MinOccurs = 0
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[0].Name = "B"
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[0].MinOccurs = 0
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[1].Name = "A"
    schema.Element[0].ComplexType.Choice.Sequence[1].Element[1].MinOccurs = 0

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()",
          "xml.print()"
      } )
      fail( "Expected exception" )
    }
    catch ( ex : RuntimeException ) {
      ex.printStackTrace()
      assertTrue(ex.Cause.Message.contains("Unique Particle Attribution"))
    }
  }

  @Test
  function testAnyTypeCanContainChildren() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Children[0] = new gw.xml.XmlElement( \"child\" )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"child\", xml.$Children[0].QName.LocalPart )"
    } )
  }

  @Test
  function testComplexTypeThatExtendsAnyTypeCanContainChildren() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.ComplexContent.Extension.Base = schema.$Namespace.qualify( "anyType" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Children[0] = new gw.xml.XmlElement( \"child\" )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"child\", xml.$Children[0].QName.LocalPart )"
    } )
  }

  @Test
  function testComplexTypeThatRestrictsAnyTypeCannotContainChildren() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.ComplexContent.Restriction.Base = schema.$Namespace.qualify( "anyType" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Children[0] = new gw.xml.XmlElement( \"child\" )",
        "try {",
        "  xml = xml.parse( xml.bytes() )",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"Unexpected child element\" )",
        "}"
    } )
  }

  @Test
  function testComplexTypeThatImplicitlyRestrictsAnyTypeCannotContainChildren() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType = new gw.xsd.w3c.xmlschema.anonymous.elements.TopLevelElement_ComplexType()
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Children[0] = new gw.xml.XmlElement( \"child\" )",
        "try {",
        "  xml = xml.parse( xml.bytes() )",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertThat().string( ex.Cause.Message ).contains( \"Unexpected child element\" )",
        "}"
    } )
  }

  // if the empty prefix was redeclared to the null nsuri and to another uri, it would previously generate invalid xml
  @Test
  function testUndeclareDefaultNamespaceAtSameLevelAsDeclaringDifferentDefaultNamespace() {
    var xml = new XmlElement( new QName( "foo", "foo" ) )
    var xml2 = new XmlElement( "child" )
    xml.addChild( xml2 )
    xml.declareNamespace( new URI( "foo" ), "" )
    xml.declareNamespace( new URI( "" ), "" )
    assertEquals( new QName( "foo", "foo" ), xml.QName )
    assertEquals( new QName( "child" ), xml.Children[0].QName )
    var output = XmlElement.parse( xml.bytes() )
    assertEquals( xml.asUTFString(), output.asUTFString() )
    assertEquals( new QName( "foo", "foo" ), output.QName )
    assertEquals( new QName( "child" ), output.Children[0].QName )
  }

  // if the empty prefix was redeclared to the null nsuri and to another uri, it would previously generate invalid xml
  @Test
  function testUndeclareDefaultNamespaceAtSameLevelAsDeclaringDifferentDefaultNamespace2() {
    var xml = new XmlElement( new QName( "foo", "foo" ) )
    var xml2 = new XmlElement( "child" )
    var root = new XmlElement( new QName( "foo", "root" ) )
    root.addChild( xml )
    root.declareNamespace( new URI( "foo" ), "" )
    xml.addChild( xml2 )
    xml.declareNamespace( new URI( "foo" ), "" )
    xml.declareNamespace( new URI( "" ), "" )
    assertEquals( new QName( "foo", "root" ), root.QName )
    assertEquals( new QName( "foo", "foo" ), root.Children[0].QName )
    assertEquals( new QName( "child" ), root.Children[0].Children[0].QName )
    var output = XmlElement.parse( root.bytes() )
    assertEquals( root.asUTFString(), output.asUTFString() )
    assertEquals( new QName( "foo", "root" ), output.QName )
    assertEquals( new QName( "foo", "foo" ), output.Children[0].QName )
    assertEquals( new QName( "child" ), output.Children[0].Children[0].QName )
  }

  @Test
  function testNullNsUriCannotBeAssignedToNamedPrefix() {
    var xml = new XmlElement( new QName( "nsuri", "localpart", "prefix" ) )
    xml.declareNamespace( new URI( "" ), "foo" )
    xml.print()
    XmlElement.parse( xml.bytes() )
  }

  @Test
  function testNullNsUriCanBeAssignedToEmptyPrefix() {
    var xml = new XmlElement( new QName( "nsuri", "localpart", "prefix" ) )
    xml.declareNamespace( new URI( "" ), "" )
    xml.print()
    XmlElement.parse( xml.bytes() )
  }

  @Test
  function testNullNsUriCannotBeAssignedToNamedPrefixEvenWithAttributeConflict() {
    var xml = new XmlElement( new QName( "nsuri", "localpart", "prefix" ) )
    xml.setAttributeValue( new QName( "", "attr" ), "value" )
    xml.setAttributeValue( new QName( "nsuri", "attr" ), "value" )
    xml.declareNamespace( new URI( "" ), "foo" )
    xml.print()
    assertEquals( new QName( "nsuri", "localpart" ), xml.QName )
    assertEquals( "value", xml.getAttributeValue( new QName( "attr" ) ) )
    assertEquals( "value", xml.getAttributeValue( new QName( "nsuri", "attr" ) ) )
    var output = XmlElement.parse( xml.bytes() )
    assertEquals( xml.asUTFString(), output.asUTFString() )
    assertEquals( new QName( "nsuri", "localpart" ), output.QName )
    assertEquals( "value", output.getAttributeValue( new QName( "attr" ) ) )
    assertEquals( "value", output.getAttributeValue( new QName( "nsuri", "attr" ) ) )
  }

  @Test
  function testNullNsUriCanBeAssignedToEmptyPrefixEvenWithAttributeConflict() {
    var xml = new XmlElement( new QName( "nsuri", "localpart", "prefix" ) )
    xml.setAttributeValue( new QName( "", "attr" ), "value" )
    xml.setAttributeValue( new QName( "nsuri", "attr" ), "value" )
    xml.declareNamespace( new URI( "" ), "" )
    xml.print()
    assertEquals( new QName( "nsuri", "localpart" ), xml.QName )
    assertEquals( "value", xml.getAttributeValue( new QName( "attr" ) ) )
    assertEquals( "value", xml.getAttributeValue( new QName( "nsuri", "attr" ) ) )
    var output = XmlElement.parse( xml.bytes() )
    assertEquals( xml.asUTFString(), output.asUTFString() )
    assertEquals( new QName( "nsuri", "localpart" ), output.QName )
    assertEquals( "value", output.getAttributeValue( new QName( "attr" ) ) )
    assertEquals( "value", output.getAttributeValue( new QName( "nsuri", "attr" ) ) )
  }

  @Test
  function testBadNamespacePrefixes() {
    var xml = new XmlElement( "foo" )
    var ns1 = "xmL"
    var ns2 = "XMLn2"
    var ns3 = "XmLn3"
    var ns4 = "foon4"
    xml.declareNamespace( new URI( "n1" ), ns1 )
    xml.declareNamespace( new URI( "n2" ), ns2 )
    xml.declareNamespace( new URI( "n3" ), ns3 )
    xml.declareNamespace( new URI( "n4" ), ns4 )
    xml.print()
    assertFalse( xml.asUTFString().contains( ns1 ) )
    assertFalse( xml.asUTFString().contains( ns2 ) )
    assertFalse( xml.asUTFString().contains( ns3 ) )
    assertTrue(xml.asUTFString().contains(ns4))
    var output = XmlElement.parse( xml.bytes () )
    output.print()
    assertFalse( output.asUTFString().contains( ns1 ) )
    assertFalse( output.asUTFString().contains( ns2 ) )
    assertFalse( output.asUTFString().contains( ns3 ) )
    assertTrue( output.asUTFString().contains( ns4 ) )
  }

  // this would previously fail since the "null namespace used" check in XmlElementInternalsImpl didn't check the
  // explicit type specified by xsi:type (since it's a QName, the same rules apply -- if null namespace is used, it
  // must be assigned to empty prefix)
  @Test
  function testRuntimeSubtypeCanExistInNullNamespace() {

    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.TargetNamespace = new URI( "urn:schema" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "urn:schema", "rootType" )
    schema.ComplexType[0].Name = "rootType"

    var schema2 = new gw.xsd.w3c.xmlschema.Schema()
    schema2.Import[0].Namespace = new URI( "urn:schema" )
    schema2.Import[0].SchemaLocation = new URI( "schema.xsd" )
    schema2.ComplexType[0].Name = "subType"
    schema2.ComplexType[0].ComplexContent.Extension.Base = new QName( "urn:schema", "rootType" )
    XmlSchemaTestUtil.runWithResources( { schema, schema2 }, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$TypeInstance = new $$TESTPACKAGE$$.schema2.types.complex.SubType()",
        "xml.declareNamespace( new java.net.URI( \"urn:schema\" ), \"\" )",
        "xml = $$TESTPACKAGE$$.schema.Root.parse( xml.bytes(), new gw.xml.XmlParseOptions() { : AdditionalSchemas = { $$TESTPACKAGE$$.schema2.util.SchemaAccess } } )",
        "assertEquals( $$TESTPACKAGE$$.schema.types.complex.RootType, statictypeof xml.$TypeInstance )",
        "assertEquals( $$TESTPACKAGE$$.schema2.types.complex.SubType, typeof xml.$TypeInstance )"
    } )
  }

  @Test
  function testXmlIdWorks() {
    var xml = new gw.spec.docbook.Book()
    xml.Id = "myid"
    assertTrue( xml.asUTFString().contains( "xml:id=\"myid\"" ) )
    xml = xml.parse( xml.bytes() )
    assertEquals( "myid", xml.Id )
  }

  @Test
  function testNamespacesInScopeDuringParseAreStillInScopeWhenSubelementIsSerialized() {
    var xml = new XmlElement( "root" )
    xml.declareNamespace( new URI( "nsuri" ), "prefix" )
    xml.addChild( new XmlElement( "child" ) )
    assertTrue( xml.asUTFString().contains( "xmlns:prefix=\"nsuri\"" ) )
    xml = xml.parse( xml.bytes() )
    assertTrue( xml.Children[0].asUTFString().contains( "xmlns:prefix=\"nsuri\"" ) )
  }

  @Test
  function testTextPropertyReturnsEmptyStringEvenIfElementContainsChildren() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    assertEquals( "", schema.$Text )
    schema.Element[0].Name = "foo"
    assertEquals( "", schema.$Text )
    var element = new XmlElement( "foo" )
    assertEquals( "", element.Text )
    element.addChild( new XmlElement( "bar" ) )
    assertEquals( "", element.Text )
    assertEquals( "", element.Children[0].Text )
  }

  @Test
  function testElementQNamePrefixIsNotPreferredOverExplicitlyDeclaredPrefix() {
    var xml = new XmlElement( new QName( "nsuri", "localpart", "prefix1" ) )
    xml.declareNamespace( new URI( "nsuri" ), "prefix2" )
    xml = xml.parse( xml.bytes() )
    assertEquals( "prefix2", xml.QName.Prefix )
  }

  @Test
  function testSecondElementInSequenceIsStaticallyTypedAfterParse() {
    // I ran into this problem where the xmlmatcher code was missing this case
    var schema = Schema.parse( "<foo:schema xmlns:foo='http://www.w3.org/2001/XMLSchema'><foo:complexType name='root'><foo:sequence/><foo:attribute name='attr' type='foo:string'/></foo:complexType></foo:schema>" )
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.elements.TopLevelComplexType_Attribute, typeof schema.ComplexType[0].$Children[1] )
    schema = schema.parse( schema.bytes() )
    assertEquals( gw.xsd.w3c.xmlschema.anonymous.elements.TopLevelComplexType_Attribute, typeof schema.ComplexType[0].$Children[1] )
  }

  @Test
  function testXmlNamespaceIsNotDeclared() {
    var xml = new gw.spec.docbook.Book()
    xml.Id = "foo"
    assertFalse( xml.asUTFString().contains( "xmlns:xml" ) )
    assertTrue( xml.asUTFString().contains( "xml:id=" ) )
    xml = xml.parse( xml.bytes() )
    assertFalse( xml.asUTFString().contains( "xmlns:xml" ) )
    assertTrue( xml.asUTFString().contains( "xml:id=" ) )
  }

  @Test
  function testCdataWithUntypedElement() {
    var xml = XmlElement.parse( "<root><![CDATA[value]]></root>" )
    assertEquals( "value", xml.Text )
    assertTrue( xml.asUTFString().contains( ">value<" ) ) // CDATA section is not output
  }

  @Test
  function testMixedCdataWithUntypedElement() {
    var xml = XmlElement.parse( "<root>va<![CDATA[l]]>ue</root>" )
    assertEquals( "value", xml.Text )
    assertTrue( xml.asUTFString().contains( ">value<" )) // CDATA section is not output
  }

  @Test
  function testMixedCdataWithUntypedElement2() {
    var xml = XmlElement.parse( "<root><![CDATA[va]]>l<![CDATA[ue]]></root>" )
    assertEquals( "value", xml.Text )
    assertTrue( xml.asUTFString().contains( ">value<" ) )// CDATA section is not output
  }

  @Test
  function testCdataWithStaticallyTypedElement() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "string" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<root><![CDATA[value]]></root>\" )",
        "assertEquals( \"value\", xml.$Text )",
        "assertThat().string( xml.asUTFString() ).contains( \">value<\" ) // CDATA section is not output"
    } )
  }

  @Test
  function testSettingChildPropertyOnExistingChildDoesNotChangeOrderOfChildren() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child1"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "child2"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child1 = 5",
        "xml.Child2 = 10",
        "assertEquals( 2, xml.$Children.Count )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[1] )",
        "assertEquals( 5, xml.Child1 )",
        "assertEquals( 5, xml.$Children[0].SimpleValue.GosuValue )",
        "xml.Child1 = 20",
        "assertEquals( 2, xml.$Children.Count )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[1] )",
        "assertEquals( 20, xml.Child1 )",
        "assertEquals( 20, xml.$Children[0].SimpleValue.GosuValue )"
    } )
  }

  @Test
  function testSettingListBasedChildPropertyOnExistingChildRemovesOldElementsThenAddsToBottomOfContentList() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Sequence.Element[0].Name = "child1"
    schema.Element[0].ComplexType.Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.Sequence.Element[0].MaxOccurs = "unbounded"
    schema.Element[0].ComplexType.Sequence.Element[1].Name = "child2"
    schema.Element[0].ComplexType.Sequence.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child1 = { 5 }",
        "xml.Child2 = 10",
        "assertEquals( 2, xml.$Children.Count )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[1] )",
        "assertEquals( 5, xml.Child1[0] )",
        "xml.Child1 = { 20 }",
        "assertEquals( 2, xml.$Children.Count )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[1] )",
        "assertEquals( 20, xml.Child1[0] )"
    } )
  }

  @Test
  function testXmlElementIsBackedByDefaultByJavaBackedAnyType() {
    var xml = new XmlElement( "root" )
    var obj = xml.TypeInstance as Object
    assertEquals( "gw.internal.schema.gw.xsd.w3c.xmlschema.types.complex.AnyType", obj.Class.Name )
  }

  @Test
  function testAddNullChildToElement() {
    var xml = new XmlElement( "root" )
    try {
      xml.addChild( null )
      fail( "Expected IllegalArgumentException" )
    }
    catch ( ex : IllegalArgumentException ) {
      // good
      assertEquals( ex.Message, 'Null content cannot be added to content list' )
    }
  }

  @Test
  function testAddNullChildToElement2() {
    var xml = new XmlElement( "root" )
    try {
      xml.getChildren().add( null )
      fail( "Expected IllegalArgumentException" )
    }
    catch ( ex : IllegalArgumentException ) {
      // good
      assertEquals( ex.Message, 'Null content cannot be added to content list' )
    }
  }

  @Test
  function testSetNullAttributeName() {
    var xml = new XmlElement( "root" )
    try {
      xml.setAttributeValue( null as String, "value" )
      fail( "Expected IllegalArgumentException" )
    }
    catch ( ex : IllegalArgumentException ) {
      // good
      assertEquals( ex.StackTrace[0].ClassName, "javax.xml.namespace.QName" )
    }
  }

  @Test
  function testSetNullAttributeQName() {
    var xml = new XmlElement( "root" )
    try {
      xml.setAttributeValue( null as QName, "value" )
      fail( "Expected IllegalArgumentException" )
    }
    catch ( ex : IllegalArgumentException ) {
      // good
      assertEquals( ex.Message, 'Attribute name cannot be null' )
    }
  }

  @Test
  function testDtdIsIgnoredOnParse() {
    var xml = XmlElement.parse( "<?xml version='1.0'?><!DOCTYPE foo SYSTEM 'doesnotexist.dtd'><root>5</root>" )
    assertEquals( "5", xml.Text )
  }

  @Test
  function testRemoveChildFromQNameBasedChildList() {
    var schema = new Schema()
    schema.Element[0].Name = "foo"
    schema.Element[1].Name = "bar"
    schema.Element[2].Name = "baz"
    assertEquals( schema.$Children.map( \ x ->x.getAttributeValue( "name" ) ), { "foo", "bar", "baz" } )
    var childrenByQName = schema.getChildren( Element.$QNAME )
    assertEquals( childrenByQName.map( \ x ->x.getAttributeValue( "name" ) ),{ "foo", "bar", "baz" } )
    assertEquals( schema.getChildren( Element.$QNAME ).map( \ x ->x.getAttributeValue( "name" ) ),{ "foo", "bar", "baz" } )
    schema.getChildren( Element.$QNAME ).removeWhere( \ x ->x.getAttributeValue("name") == "bar" )
    assertEquals( schema.$Children.map( \ x ->x.getAttributeValue( "name" ) ),{ "foo", "baz" } )
    assertEquals( childrenByQName.map( \ x ->x.getAttributeValue( "name" ) ),{ "foo", "baz" } )
    assertEquals( schema.getChildren( Element.$QNAME ).map( \ x ->x.getAttributeValue( "name" ) ),{ "foo", "baz" } )
  }

  @Test
  @Ignore("Need to verify parsing")
  function testAtomSchemaCanBeLoaded() {
//    var feed = new gw.xml.xsd.typeprovider.atom.types.complex.Feed()
//    feed.Author[0].Email[0] = "foo@bar.baz"
//    feed.print( XmlSerializationOptions.debug() ) // not a debugging statement - part of test
  }

  @Test
  @Ignore("Need to verify parsing")
  function testMinOccursNotSatisfiedResultsInAppropriateErrorMessage() {
//    var feed = new gw.xml.xsd.typeprovider.atom.Feed()
//    feed.Author[0].Email[0] = "foo@bar.baz"
//    try {
//      feed.print() // not a debugging statement - part of test
//      fail( "Expected XmlSortException" )
//    }
//    catch ( ex : XmlSortException ) {
//      assertEquals( ex.Message,  "Unable to process children of element {http://www.w3.org/2005/Atom}feed." )
//      assertEquals( ex.Cause.Message, "minOccurs not satisfied; expected at least 3 but found 1" )
//    }
  }

  @Test
  function testParseAnonymousElement() {
    try {
      gw.xsd.w3c.xmlschema.anonymous.elements.All_Element.parse( "<foo/>" )
      fail( "Expected XmlException" )
    }
    catch ( ex : XmlException ) {
      // good
      assertEquals( ex.Message, "Unable to create parser for string using schema root gw.xsd.w3c.xmlschema.anonymous.elements.All_Element" )
      assertEquals( XmlException, typeof ex.Cause )
      assertEquals( ex.Cause.Message, "parse() cannot be called on an anonymous element type" )
    }
  }

}
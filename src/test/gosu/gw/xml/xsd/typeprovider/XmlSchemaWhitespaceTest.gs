package gw.xml.xsd.typeprovider

uses org.junit.Test

class XmlSchemaWhitespaceTest {

  @Test
  function testWhitespaceIsPreservedOnElements() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = \"  Foo\\t\\tBar  \"",
        "assertEquals( \"  Foo\\t\\tBar  \", xml.$Value )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"  Foo\\t\\tBar  \", xml.$Value )",
        "xml = xml.parse( \"<Root>  Foo\\t\\tBar  </Root>\" )",
        "assertEquals( \"  Foo\\t\\tBar  \", xml.$Value )"
    } )
  }

  @Test
  function testWhitespaceIsReplacedOnAttributesEvenIfPreserveIsSpecified() {
    // the xml parser will do "replace" normalization on attribute values automatically
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "string" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attr = \"  Foo\\t\\tBar  \"",
        "assertEquals( \"  Foo  Bar  \", xml.Attr )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"  Foo  Bar  \", xml.Attr )",
        "xml = xml.parse( \"<Root Attr=\\\"  Foo\\t\\tBar  \\\"/>\" )",
        "assertEquals( \"  Foo  Bar  \", xml.Attr )"
    } )
  }

  @Test
  function testWhitespaceIsReplacedOnElements() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].SimpleType.Restriction.WhiteSpace[0].Value = Replace

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = \"  Foo\\t\\tBar  \"",
        "assertEquals( \"  Foo  Bar  \", xml.$Value )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"  Foo  Bar  \", xml.$Value )",
        "xml = xml.parse( \"<Root>  Foo\\t\\tBar  </Root>\" )",
        "assertEquals( \"  Foo  Bar  \", xml.$Value )"
    } )
  }

  @Test
  function testWhitespaceIsReplacedOnAttributes() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Restriction.WhiteSpace[0].Value = Replace

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attr = \"  Foo\\t\\tBar  \"",
        "assertEquals( \"  Foo  Bar  \", xml.Attr )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"  Foo  Bar  \", xml.Attr )",
        "xml = xml.parse( \"<Root Attr=\\\"  Foo\\t\\tBar  \\\"/>\" )",
        "assertEquals( \"  Foo  Bar  \", xml.Attr )"
    } )
  }

  @Test
  function testWhitespaceIsCollapsedOnElements() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].SimpleType.Restriction.WhiteSpace[0].Value = Collapse

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = \"  Foo\\t\\tBar  \"",
        "assertEquals( \"Foo Bar\", xml.$Value )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"Foo Bar\", xml.$Value )",
        "xml = xml.parse( \"<Root>  Foo\\t\\tBar  </Root>\" )",
        "assertEquals( \"Foo Bar\", xml.$Value )"
    } )
  }

  @Test
  function testWhitespaceIsCollapsedOnAttributes() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Attr"
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Restriction.Base = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.Attribute[0].SimpleType.Restriction.WhiteSpace[0].Value = Collapse

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attr = \"  Foo\\t\\tBar  \"",
        "assertEquals( \"Foo Bar\", xml.Attr )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"Foo Bar\", xml.Attr )",
        "xml = xml.parse( \"<Root Attr=\\\"  Foo\\t\\tBar  \\\"/>\" )",
        "assertEquals( \"Foo Bar\", xml.Attr )"
    } )
  }

  @Test
  function testNmtokensIsCollapsed() {
    // sanity check to ensure that a built-in collapse type derived from xsd:list is collapsed
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "NMTOKENS" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  Foo   \\t\\tBar  </Root>\" )",
        "assertEquals( 2, xml.$Value.Count )",
        "assertEquals( \"Foo\", xml.$Value[0] )",
        "assertEquals( \"Bar\", xml.$Value[1] )"
    } )
  }

  @Test
  function testXsdListIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].SimpleType.List.ItemType = schema.$Namespace.qualify( "int" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  3    \\t\\t4  </Root>\" )",
        "assertEquals( 2, xml.$Value.Count )",
        "assertEquals( java.lang.Integer, typeof xml.$Value[0] )",
        "assertEquals( 3, xml.$Value[0] )",
        "assertEquals( 4, xml.$Value[1] )"
    } )
  }

  @Test
  function testIdrefsIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].ComplexType.Attribute[0].Name = "Ref"
    schema.Element[0].ComplexType.Attribute[0].Type = schema.$Namespace.qualify( "IDREFS" )
    schema.Element[0].ComplexType.Attribute[1].Name = "ID"
    schema.Element[0].ComplexType.Attribute[1].Type = schema.$Namespace.qualify( "ID" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root ID=\\\"   foo   \\\" Ref=\\\"\\t   \\n   foo    \\n   foo   \\n   \\\"/>\" )",
        "assertEquals( 2, xml.Ref.Count )",
        "assertSame( xml, xml.Ref[0] )",
        "assertSame( xml, xml.Ref[1] )"
    } )
  }

  @Test
  function testBooleanPrimitiveTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "boolean" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  \\n  \\r  true  \\t\\t  </Root>\" )",
        "assertEquals( java.lang.Boolean ,typeof xml.$Value )",
        "assertEquals( true as boolean,  xml.$Value )"
    } )
  }

  @Test
  function testFloatPrimitiveTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "float" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  \\n  \\r  33.4   \\t\\t  </Root>\" )",
        "assertEquals( java.lang.Float, typeof xml.$Value )",
        "assertEquals( 33.4   as float, xml.$Value )"
    } )
  }

  @Test
  function testDoublePrimitiveTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "double" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  \\n  \\r  123.45   \\t\\t  </Root>\" )",
        "assertEquals( java.lang.Double, typeof xml.$Value )",
        "assertEquals( 123.45   as double, xml.$Value )"
    } )
  }

  @Test
  function testDecimalPrimitiveTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "short" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  \\n  \\r  3    \\t\\t  </Root>\" )",
        "assertEquals( java.lang.Short, typeof xml.$Value )",
        "assertEquals( 3 as short, xml.$Value )"
    } )
  }

  @Test
  function testDateTimeTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "dateTime" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  \\n  \\r  1970-01-01T00:00:00Z   \\t\\t  </Root>\" )",
        "assertEquals( gw.xml.date.XmlDateTime, typeof xml.$Value )",
        "assertEquals( \"1970-01-01T00:00:00Z\"  , xml.$Value.toString() )"
    } )
  }

  @Test
  function testgYearMonthTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "gYearMonth" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>  \\n  \\r  1970-01Z   \\t\\t  </Root>\" )",
        "assertEquals( gw.xml.date.XmlYearMonth, typeof xml.$Value )",
        "assertEquals( \"1970-01Z\"  , xml.$Value.toString() )"
    } )
  }

  @Test
  function testQNameTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "QName" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root xmlns:prefix=\\\"nsuri\\\">   \\t\\t  prefix:localpart   \\t\\t  </Root>\" )",
        "assertEquals( javax.xml.namespace.QName, typeof xml.$Value )",
        "assertEquals( \"{nsuri}localpart\"  , xml.$Value.toString() )"
    } )
  }

  @Test
  function testanyURLTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "anyURI" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>   \\t\\t  http://guidewire.com   \\t\\t  </Root>\")",
        "assertEquals( java.net.URI, typeof xml.$Value )",
        "assertEquals( \"http://guidewire.com\"  , xml.$Value.toString() )"
    } )
  }

 /*
   @Test
 function testNormalizedStringTypeIsCollapsed() {
    var schema = new gw.xsd.w3c.xmlschema.Schema()
    schema.Element[0].Name = "Root"
    schema.Element[0].Type = schema.$Namespace.qualify( "normalizedString" )
    XmlSchemaTestUtil.runWithResource( schema, {
      "var xml = $$TESTPACKAGE$$.schema.Root.parse( \"<Root>   \\t\\t  foo bar baz   \\t\\t  </Root>\")",
      "print (typeof xml.$Value)",
      "print (xml.$Value)",
       // "assertEquals( gw.xsd.w3c.xmlschema.types.simple.NormalizedString, typeof xml.$Value )",
      "assertEquals( java.lang.String, typeof xml.$Value )",
      "assertEquals( \"foo bar baz\"  , xml.$Value.toString() )"
    } )

  }
  */
}
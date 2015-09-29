package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses java.net.URI
uses javax.xml.namespace.QName
uses gw.xml.XmlNamespace
uses gw.xml.XmlElement
uses gw.util.Pair
uses org.junit.Test

class XmlSchemaNamespaceTest extends XSDTest {

  // PL-14650
  @Test
  function testNamespaceAreEqualWhenEqual() {
    var lhs = new XmlNamespace("http:/example.com/mynamespace","l")
    var rhs = new XmlNamespace("http:/example.com/mynamespace","r")
    assertEquals(lhs, rhs)
    assertEquals(lhs.hashCode(), rhs.hashCode())
  }

  // PL-13519
  @Test
  function testNamespaceOnlyGetsDeclaredOnceIfUsedOnElementAndAttributes() {
    var schema = new Schema()
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.Attribute[0].Ref = new QName( "urn:foo", "attr1" )
    schema.Element[0].ComplexType.Attribute[1].Ref = new QName( "urn:foo", "attr2" )
    schema.Attribute[0].Name = "attr1"
    schema.Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.Attribute[1].Name = "attr2"
    schema.Attribute[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Attr1 = 5",
        "xml.Attr2 = 10",
        "xml.print()",
        "assertEquals( \"<?xml version=\\\"1.0\\\"?>\\\n<ns0:root ns0:attr1=\\\"5\\\" ns0:attr2=\\\"10\\\" xmlns:ns0=\\\"urn:foo\\\"/>\", xml.asUTFString() )"
    } )
  }

  // in the past, the tns prefix was treated specially
  @Test
  function testTnsPrefixIsPreservedInInstanceDocument() {
    var schema = new Schema()
    schema.declareNamespace( new XmlNamespace( "urn:foo", "tns" ) )
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = 5",
        "assertEquals( \"<?xml version=\\\"1.0\\\"?>\\\n<tns:root xmlns:tns=\\\"urn:foo\\\">5</tns:root>\", xml.asUTFString() )"
    } )

  }

  @Test
  function testEmptyPrefixIsPreservedInInstanceDocument() {
    var schema = new Schema()
    schema.declareNamespace( new XmlNamespace( "urn:foo" ) )
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = 5",
        "assertEquals( \"<?xml version=\\\"1.0\\\"?>\\\n<root xmlns=\\\"urn:foo\\\">5</root>\", xml.asUTFString() )"
    } )

  }

  // in the past, the nsX prefix was treated specially, where X is any number
  @Test
  function testNs0PrefixIsPreservedInInstanceDocument() {
    var schema = new Schema()
    schema.declareNamespace( new XmlNamespace( "urn:foo", "ns0" ) )
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = 5",
        "assertEquals( \"<?xml version=\\\"1.0\\\"?>\\\n<ns0:root xmlns:ns0=\\\"urn:foo\\\">5</ns0:root>\", xml.asUTFString() )"
    } )

  }

  @Test
  function testFooPrefixIsPreservedInInstanceDocument() {
    var schema = new Schema()
    schema.declareNamespace( new XmlNamespace( "urn:foo", "foo" ) )
    schema.TargetNamespace = new URI( "urn:foo" )
    schema.Element[0].Name = "root"
    schema.Element[0].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.$Value = 5",
        "assertEquals( \"<?xml version=\\\"1.0\\\"?>\\\n<foo:root xmlns:foo=\\\"urn:foo\\\">5</foo:root>\", xml.asUTFString() )"
    } )

  }

  @Test
  function testNamespaceDeclarationsAreSortedByPrefix() {
    var expectedSortOrder = 'xmlns:a="zzz" xmlns:b="aaa" xmlns:c="yyy" xmlns:d="bbb" xmlns:tns="nsuri1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
    var xml = new gw.xml.xsd.typeprovider.xmlschemanamespacetestschema.Root( new gw.xml.xsd.typeprovider.xmlschemanamespacetestschema.types.complex.RootSubType() )
    xml.$Value = new QName( "zzz", "value", "a" )
    xml.Attr1 = new QName( "aaa", "value", "b" )
    xml.declareNamespace( new XmlNamespace( "yyy", "c" ) )
    xml.Attr2 = new QName( "bbb", "value", "d" )
    assertTrue(xml.asUTFString().contains(expectedSortOrder))

    xml = new gw.xml.xsd.typeprovider.xmlschemanamespacetestschema.Root( new gw.xml.xsd.typeprovider.xmlschemanamespacetestschema.types.complex.RootSubType() )
    xml.$Value = new QName( "bbb", "value", "d" )
    xml.Attr1 = new QName( "yyy", "value", "c" )
    xml.declareNamespace( new XmlNamespace( "aaa", "b" ) )
    xml.Attr2 = new QName( "zzz", "value", "a" )
    assertTrue(xml.asUTFString().contains(expectedSortOrder))
  }

  // previously, this would cause multiple declarations of the same namespace uri with different prefixes
  @Test
  function testNamespaceIsNotMultipleTimesInOutputIfExplicitlyDeclaredMultipleTimes() {
    var xml = new XmlElement( "root" )
    xml.declareNamespace( new QName( "nsuri", "localpart", "tns1" ) )
    xml.declareNamespace( new QName( "nsuri2", "localpart", "tns1" ) )
    xml.declareNamespace( new QName( "nsuri", "localpart", "tns1" ) )
    xml.declareNamespace( new QName( "nsuri2", "localpart", "tns1" ) )
    assertTrue(xml.asUTFString().contains('<root xmlns:tns1="nsuri" xmlns:tns12="nsuri2"/>'))
  }

  @Test
  function testAttributesDoNotPickUpDefaultNamespace() {
    var xml = new XmlElement( new QName( "nsuri", "root", "" ) )
    xml.setAttributeValue( new QName( "nsuri", "attr" ), "value" )
    xml = xml.parse( xml.bytes() )
    assertEquals( "value", xml.getAttributeValue( new QName( "nsuri", "attr" ) ) )
    assertNull( "value", xml.getAttributeValue( "attr" ) )
  }

  // not a big deal, but this is the current behavior
  @Test
  function testAttributePrefixIsPreferredOverElementPrefix() {
    var elementPrefix = "elementPrefix"
    var attrPrefix = "attrPrefix"
    var xml = new XmlElement( new QName( "nsuri", "root", elementPrefix ) )
    xml.setAttributeValue( new QName( "nsuri", "attr", attrPrefix ), "value" )
    assertTrue(xml.asUTFString().contains(attrPrefix))
    assertFalse(xml.asUTFString().contains(elementPrefix))
  }

  @Test
  function testElementRetainsDeclaredDefaultNamespaceOnReserialization() {
    var xmlString = '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns="urn:foo"><xs:element name="root" type="rootType"/></xs:schema>'
    var xml = XmlElement.parse( xmlString )
    assertEquals( "rootType", xml.Children[0].getAttributeValue( "type" ) )
    var s = Schema.parse( xmlString )
    assertEquals( "urn:foo", s.Element[0].Type.NamespaceURI )
    assertEquals( "rootType", s.Element[0].Type.LocalPart )

    var newXml = new XmlElement( new QName( Schema.$QNAME.NamespaceURI, "schema" ) )
    newXml.addChild( xml.Children[0] )
    newXml.print()
    s = Schema.parse( newXml.bytes() )
    assertEquals( "urn:foo", s.Element[0].Type.NamespaceURI )
    assertEquals( "rootType", s.Element[0].Type.LocalPart )
  }

  @Test
  function testDeclaredNamespaceBindingsAfterParse_WithoutXmlNamespace() {
    // it's ok to have duplicate declared namespaces, but this particular test shouldn't produce any such duplicates
    var root = XmlElement.parse( "<root xmlns:foo='urn:foo'><child xmlns:bar='urn:bar' xml:lang=''/></root>" )
    var child = root.getChild( "child" )
    var rootExpected = {
        new Pair<String,URI>( "", new URI( "" ) ),
        new Pair<String,URI>( "foo", new URI( "urn:foo" ) )
    }
    assertEquals(rootExpected.Count, root.DeclaredNamespaces.size()) // this ensures no duplicates
    assertEquals(root.DeclaredNamespaces.toSet(), rootExpected.toSet())
    var childExpected = {
        new Pair<String,URI>( "", new URI( "" ) ),
        new Pair<String,URI>( "foo", new URI( "urn:foo" ) ),
        new Pair<String,URI>( "bar", new URI( "urn:bar" ) )
    }
    assertEquals(childExpected.Count, child.DeclaredNamespaces.size()) // this ensures no duplicates
    assertEquals( child.DeclaredNamespaces.toSet(),  childExpected.toSet() )
    assertEquals(root.asUTFString(), '<?xml version="1.0"?>\n<root xmlns:foo="urn:foo">\n  <child xml:lang="" xmlns:bar="urn:bar"/>\n</root>')
    assertEquals(child.asUTFString(), '<?xml version="1.0"?>\n<child xml:lang="" xmlns:bar="urn:bar" xmlns:foo="urn:foo"/>')
  }

  @Test
  function testDeclaredNamespaceBindingsAfterParse_WithXmlNamespace() {
    // it's ok to have duplicate declared namespaces, but this particular test shouldn't produce any such duplicates
    // the "xml" namespace doesn't actually need to be declared before it is used
    var root = XmlElement.parse( "<root xmlns:foo='urn:foo' xmlns:xml='http://www.w3.org/XML/1998/namespace'><child xmlns:bar='urn:bar' xml:lang=''/></root>" )
    var child = root.getChild( "child" )
    var rootExpected = {
        new Pair<String,URI>( "", new URI( "" ) ),
        new Pair<String,URI>( "foo", new URI( "urn:foo" ) )
    }
    assertEquals(rootExpected.Count, root.DeclaredNamespaces.size())  // this ensures no duplicates
    assertEquals( root.DeclaredNamespaces.toSet(), rootExpected.toSet() )
    var childExpected = {
        new Pair<String,URI>( "", new URI( "" ) ),
        new Pair<String,URI>( "foo", new URI( "urn:foo" ) ),
        new Pair<String,URI>( "bar", new URI( "urn:bar" ) )
    }
    assertEquals(childExpected.Count, child.DeclaredNamespaces.size()) // this ensures no duplicates
    assertEquals(child.DeclaredNamespaces.toSet(), childExpected.toSet())
    // the "xml" namespace doesn't actually need to be declared before it is used
    assertEquals(root.asUTFString(), '<?xml version="1.0"?>\n<root xmlns:foo="urn:foo">\n  <child xml:lang="" xmlns:bar="urn:bar"/>\n</root>')
    assertEquals(child.asUTFString(), '<?xml version="1.0"?>\n<child xml:lang="" xmlns:bar="urn:bar" xmlns:foo="urn:foo"/>')
  }

//  @Test
//  function testPL26649() {
//    assertNotNull( new gw.xml.xsd.typeprovider.pl26649.comparenowservice.InsuranceAutoV2012July() )
//  }

}
package gw.xml.xsd.typeprovider

uses gw.xsd.w3c.xmlschema.Schema
uses javax.xml.namespace.QName
uses java.lang.RuntimeException

uses org.junit.Test
uses org.xml.sax.SAXParseException
uses gw.xml.XmlSortException
uses gw.xml.XmlSerializationOptions
uses java.lang.Exception

class XmlSchemaAllTest extends XSDTest {

  @Test
  function testAllWithElementRef() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Ref = new QName( "child" )
    schema.Element[1].Name = "child"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "xml = xml.parse( xml.bytes() )",
        "print('foo')",
        "assertEquals( 5, xml.Child )"
    } )
  }

  @Test
  function testAllWithAnonymousElement() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child"
    schema.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.print()
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child = 5",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( 5, xml.Child )"
    } )
  }

  @Test
  function testAllWithAnonymousElementHasAttributes() {

    var schema = new Schema()
    schema.Element[0].Name = "user"
    schema.Element[0].Type = new QName("userType")

    schema.ComplexType[0].Name = "userType"
    schema.ComplexType[0].All.Element[0].Name = "role"
    schema.ComplexType[0].All.Element[0].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].Attribute[0].Name = "username"
    schema.ComplexType[0].Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].Attribute[0].Use = Required
    schema.ComplexType[0].Attribute[1].Name = "password"
    schema.ComplexType[0].Attribute[1].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].Attribute[1].Use = Optional

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.User()",
        "xml.Role = \"Admin\"",
        "xml.Username = \"su\"",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( \"Admin\", xml.Role )"
    } )
  }

  @Test
  function testAllWithSubstitutionGroup() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Ref = new QName( "head" )
    schema.Element[1].Name = "head"
    schema.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[2].Name = "member"
    schema.Element[2].SubstitutionGroup = new QName( "head" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Head_elem = new $$TESTPACKAGE$$.schema.Member()",
        "xml.Head = 5",
        "assertEquals( $$TESTPACKAGE$$.schema.Head, statictypeof xml.Head_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member, typeof xml.Head_elem )",
        "assertEquals( 5, xml.Head )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Head, statictypeof xml.Head_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member, typeof xml.Head_elem )",
        "assertEquals( 5, xml.Head )",
        "xml = xml.parse( \"<root><member>5</member></root>\" )",
        "assertEquals( $$TESTPACKAGE$$.schema.Head, statictypeof xml.Head_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member, typeof xml.Head_elem )",
        "assertEquals( 5, xml.Head )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Head, statictypeof xml.Head_elem )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member, typeof xml.Head_elem )",
        "assertEquals( 5, xml.Head )"
    } )
  }

  @Test
  function testAllDoesNotSortChildren() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.Element[0].ComplexType.All.Element[2].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child2 = 4",
        "xml.Child3 = 9",
        "xml.Child1 = 4",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[2] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[2] )"
    } )
  }

  @Test
  function testAllDoesNotSortEmptyChildrenWithOnlyAttributes() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.Element[0].ComplexType.All.Element[0].Type = new QName( "type1" )
    schema.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.Element[0].ComplexType.All.Element[1].Type = new QName( "type2" )
    schema.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.Element[0].ComplexType.All.Element[2].Type = new QName( "type3" )

    schema.ComplexType[0].Name = "type1"
    schema.ComplexType[0].Attribute[0].Name = "attri1"
    schema.ComplexType[0].Attribute[0].Type = schema.$Namespace.qualify( "int" )
    schema.ComplexType[0].Attribute[0].Use = Required

    schema.ComplexType[1].Name = "type2"
    schema.ComplexType[1].Attribute[0].Name = "attri2"
    schema.ComplexType[1].Attribute[0].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[1].Attribute[0].Use = Optional

    schema.ComplexType[2].Name = "type3"
    schema.ComplexType[2].Attribute[0].Name = "attri3"
    schema.ComplexType[2].Attribute[0].Type = schema.$Namespace.qualify( "boolean" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child2.Attri2 = \"jjjjj\"",
        "xml.Child3.$TypeInstance = new $$TESTPACKAGE$$.schema.types.complex.Type3()",
        "xml.Child1.Attri1 = 3",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[2] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[2] )"
    } )
  }

  @Test
  function testAllDoesNotSortChildrenWithDifferentTypes() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "decimal" )
    schema.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "string" )
    schema.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.Element[0].ComplexType.All.Element[2].Type = schema.$Namespace.qualify( "boolean" )
    schema.Element[0].ComplexType.All.Element[3].Name = "child4"
    schema.Element[0].ComplexType.All.Element[3].Type = schema.$Namespace.qualify( "date" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child2 = \"asdfsf\"",
        "xml.Child3 = true",
        "xml.Child1 = 123.45",
        "xml.Child4 = new gw.xml.date.XmlDate()",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[2] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child4, typeof xml.$Children[3] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child1, typeof xml.$Children[2] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.Root_Child4, typeof xml.$Children[3] )"
    } )
  }


  @Test
  function testAllInsideOfSequenceDoesNotSortChildren() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "rootType" )

    schema.ComplexType[0].Name = "rootType"
    schema.ComplexType[0].Sequence.Element[0].Name = "fullRecord"
    schema.ComplexType[0].Sequence.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.ComplexType[0].Sequence.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].Sequence.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.ComplexType[0].Sequence.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.ComplexType[0].Sequence.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.ComplexType[0].Sequence.Element[0].ComplexType.All.Element[2].Type = schema.$Namespace.qualify( "boolean" )

    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.FullRecord.Child2 = 3",
        "xml.FullRecord.Child3 = true",
        "xml.FullRecord.Child1 = \"rrrr\"",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.RootType_FullRecord_Child2, typeof xml.FullRecord.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.RootType_FullRecord_Child3, typeof xml.FullRecord.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.RootType_FullRecord_Child1, typeof xml.FullRecord.$Children[2] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.RootType_FullRecord_Child2, typeof xml.FullRecord.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.RootType_FullRecord_Child3, typeof xml.FullRecord.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.anonymous.elements.RootType_FullRecord_Child1, typeof xml.FullRecord.$Children[2] )"
    } )
  }


  @Test
  function testAllWithSubstitutionGroupsWorksAndDoesNotSortChildren() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Ref = new QName( "head1" )
    schema.Element[0].ComplexType.All.Element[1].Ref = new QName( "head2" )
    schema.Element[0].ComplexType.All.Element[2].Ref = new QName( "head3" )
    schema.Element[1].Name = "head1"
    schema.Element[2].Name = "member1"
    schema.Element[2].SubstitutionGroup = new QName( "head1" )
    schema.Element[3].Name = "head2"
    schema.Element[4].Name = "member2"
    schema.Element[4].SubstitutionGroup = new QName( "head2" )
    schema.Element[5].Name = "head3"
    schema.Element[6].Name = "member3"
    schema.Element[6].SubstitutionGroup = new QName( "head3" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Head2 = new $$TESTPACKAGE$$.schema.Member2()",
        "xml.Head3 = new $$TESTPACKAGE$$.schema.Member3()",
        "xml.Head1 = new $$TESTPACKAGE$$.schema.Member1()",
        "assertEquals( $$TESTPACKAGE$$.schema.Member2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member1, typeof xml.$Children[2] )",
        "xml = xml.parse( xml.bytes() )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member2, typeof xml.$Children[0] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member3, typeof xml.$Children[1] )",
        "assertEquals( $$TESTPACKAGE$$.schema.Member1, typeof xml.$Children[2] )"
    } )
  }

  @Test
  function testAllWithSubstitutionGroupDoesNotAllowAmbiguity() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Ref = new QName( "head" )
    schema.Element[0].ComplexType.All.Element[1].Name = "member"
    schema.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "int" )

    schema.Element[1].Name = "head"
    schema.Element[1].Type = schema.$Namespace.qualify( "int")

    schema.Element[2].Name = "member"
    schema.Element[2].SubstitutionGroup = new QName( "head" )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()",
          "xml.print( new gw.xml.XmlSerializationOptions() { : Sort = false } )"
      })
      fail("Expected SAXParseException")
    }
    catch( ex : RuntimeException ) {
      var cause = ex.getCauseOfType( SAXParseException )
      assertNotNull("Found exception cause of type SAXParseException", cause)
      assertTrue(  cause.Message.contains("During validation against this schema, ambiguity would be created") )
    }
  }

  @Test
  function testSortAllWithMissingChild() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.Element[0].ComplexType.All.Element[2].Type = schema.$Namespace.qualify( "int" )
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child2 = 5",
        "xml.Child1 = 5",
        "try {",
        "  xml.asUTFString()",
        "  fail( \"Expected XmlSortException\" )",
        "}",
        "catch ( ex : gw.xml.XmlSortException ) {",
        "  // good",
        "  assertEquals( \"Unable to process children of element root. Expected one of {child3}\", ex.Message )",
        "}"
    } )
  }

  @Test
  function testSortAllWithMissingOptionalChild() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.Element[0].ComplexType.All.Element[2].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[2].MinOccurs = _0
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child2 = 5",
        "xml.Child1 = 5",
        "xml.asUTFString()"
    } )
  }

  @Test
  function testSortAllWithMissingOptionalChildOneSpecifiedOneNotSpecified() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[1].MinOccurs = _0
    schema.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.Element[0].ComplexType.All.Element[2].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[2].MinOccurs = _0
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child2 = 5",
        "xml.Child1 = 5",
        "xml.asUTFString()"
    } )
  }

  @Test
  function testSortAllWithMissingOptionalChildrenAllSpecified() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].ComplexType.All.Element[0].Name = "child1"
    schema.Element[0].ComplexType.All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[0].MinOccurs = _0
    schema.Element[0].ComplexType.All.Element[1].Name = "child2"
    schema.Element[0].ComplexType.All.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[1].MinOccurs = _0
    schema.Element[0].ComplexType.All.Element[2].Name = "child3"
    schema.Element[0].ComplexType.All.Element[2].Type = schema.$Namespace.qualify( "int" )
    schema.Element[0].ComplexType.All.Element[2].MinOccurs = _0
    XmlSchemaTestUtil.runWithResource( schema, {
        "var xml = new $$TESTPACKAGE$$.schema.Root()",
        "xml.Child2 = 5",
        "xml.Child1 = 5",
        "xml.Child3 = 5",
        "xml.asUTFString()"
    } )
  }

  @Test
  function testAllMustBeAtTheTopLevelOfComplexType() {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "problemType" )

    schema.ComplexType[0].Name = "problemType"
    schema.ComplexType[0].Sequence.Element[0].Name = "child1"
    schema.ComplexType[0].Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.ComplexType[0].Sequence.Element[1].Name = "child2"
    schema.ComplexType[0].Sequence.Element[1].Type = schema.$Namespace.qualify( "string" )

    schema.ComplexType[0].All.Element[0].Name = "child1"
    schema.ComplexType[0].All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.ComplexType[0].All.Element[0].MinOccurs = gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._0

    try {
      schema.print( XmlSerializationOptions.debug() )
      schema.print()
      fail("Expected XmlSortException")
    }
    catch( ex : XmlSortException ) {
      assertTrue(  ex.Message.contains("Unable to process children") )
    }
  }

  @Test
  function testAllCanNotContainMultipleElementsWithSameNameAndSameTypeMinOccurAsZero () {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "someAllType" )

    schema.ComplexType[0].Name = "someAllType"

    schema.ComplexType[0].All.Element[0].Name = "child1"
    schema.ComplexType[0].All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.ComplexType[0].All.Element[0].MinOccurs = gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._0

    schema.ComplexType[0].All.Element[1].Name = "child1"
    schema.ComplexType[0].All.Element[1].Type = schema.$Namespace.qualify( "int" )
    schema.ComplexType[0].All.Element[1].MinOccurs = gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._0
    schema.print( XmlSerializationOptions.debug() )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()"
      } )
    } catch( ex : Exception ) {
      var cause = ex.getCauseOfType( SAXParseException )
      assertTrue(  cause.Message.contains("cos-nonambig: child1 and child1") )
    }
  }

  @Test
  function testAllCanNotContainMultipleElementsWithSameNameButDiffTypeMinOccurAsZero () {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "someAllType" )

    schema.ComplexType[0].Name = "someAllType"

    schema.ComplexType[0].All.Element[0].Name = "child1"
    schema.ComplexType[0].All.Element[0].Type = schema.$Namespace.qualify( "int" )
    schema.ComplexType[0].All.Element[0].MinOccurs = gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._0

    schema.ComplexType[0].All.Element[1].Name = "child1"
    schema.ComplexType[0].All.Element[1].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].All.Element[1].MinOccurs = gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._0
    schema.print( XmlSerializationOptions.debug() )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()"
      } )
    } catch( ex : Exception ) {
      var cause = ex.getCauseOfType( SAXParseException )
      assertTrue(  cause.Message.contains("cos-element-consistent: Error for type") )
    }
  }

  @Test
  function testAllCanNotContainMultipleElementsWithSameNameButDiffTypeMinOccurAsOne () {
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "someAllType" )

    schema.ComplexType[0].Name = "someAllType"

    schema.ComplexType[0].All.Element[0].Name = "child1"
    schema.ComplexType[0].All.Element[0].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].All.Element[0].MinOccurs = gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._1

    schema.ComplexType[0].All.Element[1].Name = "child1"
    schema.ComplexType[0].All.Element[1].Type = schema.$Namespace.qualify( "string" )
    schema.ComplexType[0].All.Element[1].MinOccurs = gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._1
    schema.print( XmlSerializationOptions.debug() )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()"
      } )
    } catch( ex : Exception ) {
      var cause = ex.getCauseOfType( SAXParseException )
      assertTrue(  cause.Message.contains("cos-nonambig: child1 and child1") )
    }
  }

  @Test
  function testAllCanNotBeSiblingWithSequence() { // from <xs:group name="particle">
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "someType" )

    schema.ComplexType[0].Name = "someType"
    schema.ComplexType[0].Sequence.Element[0].Name = "child1"
    schema.ComplexType[0].Sequence.Element[0].Type = schema.$Namespace.qualify( "int" )

    schema.ComplexType[0].All.Element[0].Name = "child1"
    schema.ComplexType[0].All.Element[0].Type = schema.$Namespace.qualify( "int" )

    schema.print( XmlSerializationOptions.debug() )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()"
      } )
    } catch( ex : Exception ) {
      assertTrue(  ex.Cause.Message.contains("Extra elements found") )
    }
  }

  @Test
  function testAllCanNotBeSiblingWithChoice() {  // from <xs:group name="particle">
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "someType" )

    schema.ComplexType[0].Name = "someType"
    schema.ComplexType[0].Choice.Element[0].Name = "child1"
    schema.ComplexType[0].Choice.Element[0].Type = schema.$Namespace.qualify( "int" )

    schema.ComplexType[0].All.Element[0].Name = "child1"
    schema.ComplexType[0].All.Element[0].Type = schema.$Namespace.qualify( "int" )

    schema.print( XmlSerializationOptions.debug() )

    try {
      XmlSchemaTestUtil.runWithResource( schema, {
          "var xml = new $$TESTPACKAGE$$.schema.Root()"
      } )
    } catch( ex : Exception ) {
      assertTrue(  ex.Cause.Message.contains("Extra elements found") )
    }
  }

  @Test
  function testSequenceCannotContainAll() {  // from <xs:group name="particle">
    var schema = new Schema()
    schema.Element[0].Name = "root"
    schema.Element[0].Type = new QName( "someType" )

    schema.ComplexType[0].Name = "someType"

    schema.ComplexType[0].Sequence.Element[0].Name = "child1"
    schema.ComplexType[0].Sequence.Element[0].Type = schema.$Namespace.qualify("string")

    //Q:  why is this minOccur of type - java.math.BigInteger? instead of gw.xsd.w3c.xmlschema.enums.NarrowMaxMin_MinOccurs._0
    schema.ComplexType[0].Sequence.Any[0].MinOccurs = 0
    schema.ComplexType[0].Sequence.Any[0].ProcessContents = Lax

    var type = typeof schema.ComplexType[0].Sequence
    assertNotNull( type.TypeInfo.getProperty( "Any" ) )
    assertNull( type.TypeInfo.getProperty( "All" ) ) // not allowed under xs:sequence - now enforced statically

//    schema.ComplexType[0].Sequence.All[0].Name = "child1"
//    schema.ComplexType[0].Sequence.All[0].Element[0].Type = schema.$Namespace.qualify( "int" )
//
//    schema.print( XmlSerializationOptions.debug() )
//
//     try {
//        XmlSchemaTestUtil.runWithResource( schema, {
//          "var xml = new schema.Root()"
//        } )
//    } catch( ex : Exception ) {
//      assertThat(ex.Cause.Message).as( "Exception message" ).containsIgnoringCase("Unexpected child element: {http://www.w3.org/2001/XMLSchema}all")
//    }
  }

}
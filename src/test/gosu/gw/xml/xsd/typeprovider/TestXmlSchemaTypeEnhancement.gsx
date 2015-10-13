package gw.xml.xsd.typeprovider

enhancement TestXmlSchemaTypeEnhancement : gw.xml.xsd.typeprovider.tst.Root {

  property get Foo() : String
  {
    return this.String
  }

  property set Foo(s : String)
  {
    this.String = s
  }

  function Foo() : String
  {
    return this.String
  }

  function Foo(s : String)
  {
    this.String = s
  }

}
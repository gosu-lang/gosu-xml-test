package bootstrap

uses org.junit.Assert
uses org.junit.Test
uses bootstrap.shiporder.Shiporder
uses bootstrap.shiporder.anonymous.elements.Shiporder_Item

class BootstrapTest {

  @Test
  function simplePropertyWriteAndReadWorks() {
    var order = new Shiporder()
    order.Orderperson = "Foo"
    Assert.assertEquals("Foo", order.Orderperson)
  }

  @Test
  function nestedPropertyWorks() {
    var order = new Shiporder()

    order.Shipto.Name = "name1"
    order.Shipto.Address = "address1"
    order.Shipto.City = "city1"
    order.Shipto.Country = "Country1"

    Assert.assertEquals("name1", order.Shipto.Name)
    Assert.assertEquals("address1", order.Shipto.Address)
    Assert.assertEquals("city1", order.Shipto.City)
    Assert.assertEquals("Country1", order.Shipto.Country)
  }

  @Test
  function arrayPropertyWorks() {
    var order = new Shiporder()

    Assert.assertEquals(0, order.Item.Count)

    var e = new Shiporder_Item()
    e.Title = "Demo Item"
    order.Item.add(e)

    Assert.assertEquals(1, order.Item.Count)
    Assert.assertEquals("Demo Item", order.Item.first().Title)
  }

}
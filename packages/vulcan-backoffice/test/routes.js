import expect from "expect";
import { generateRoutes } from "../lib/modules/setupCollectionRoutes";

const DummyCollection = {
  options: {
    collectionName: "Dummies"
  }
};
describe("setupCollectionRoutes", function() {
  it("generate routes", function() {
    const { baseRoute, newRoute, editRoute, detailsRoute } = generateRoutes(
      DummyCollection
    );
    expect(baseRoute.path).toEqual("/dummies");
    expect(editRoute.path).toEqual("/dummies/:documentId/edit");
    expect(newRoute.path).toEqual("/dummies/new");
    expect(detailsRoute.path).toEqual("/dummies/:documentId");
  });
});

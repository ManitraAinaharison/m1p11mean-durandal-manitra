const { SubService } = require("../../service/schemas/subservice.schema");
const serviceDataFile = require("./service.datafile");
const { postServices } = require("./service.mock-services");

module.exports.createServices = createServices = async () => {
  try {
    const subServicesFound = await SubService.find();
    let services = serviceDataFile.services;

    services = services.map((service) => {
      const subServicesSlugArray = service.subServices.map((sub) => sub.slug);
      const serviceSubServices = subServicesFound.filter((sub) => {
        return subServicesSlugArray.some((slug) => (slug === sub.slug));
      })
      .map((sub)=>(sub._id));
      return { ...service, subServices: serviceSubServices };
    });

    // console.log(services.map((s)=>(s.subServices)).flat(1))
    // console.log(services.filter((s)=>(!s.imgPath || !s.description || !s.name)))

    return await postServices(services);
  } catch (error) {
    console.log("can't insert services");
    throw error;
  } finally {
    console.log("postServices");
  }
};

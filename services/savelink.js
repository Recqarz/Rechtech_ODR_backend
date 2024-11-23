const { CASEDATA } = require("../model/caseData.model");

const saveTheLink = async (link, id, caseid) => {
  try {
    const cases = await CASEDATA.findById(caseid);
    cases.meetLinks.push(link);
    cases.meetId.push(id);
    await cases.save();
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { saveTheLink };

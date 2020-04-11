const InstrumentService = require('../services/InstrumentService');

const controller = {
  getInstruments: async (req, res) => {
    const { symbol, projection } = req.body;

    try {
        const reply = await InstrumentService.getInstruments(symbol, projection);
        res.status(200).send(reply);
    } catch (err) {
        console.log(`Error in getInstrument ${err}`);
        res.status(500).send({ error: `Error in getInstrument ${err}` })
    }
  }
};

module.exports = controller;
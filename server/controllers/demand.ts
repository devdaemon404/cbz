import Recruitment from '../models/Recruitment';
import Demand from '../models/Demand';
import DemandCount from '../models/DemandIdCount';

export const addRequestIdToDemand = async (req, res) => {
  const { clientId, demandId } = req.body;
  // TODO: Find the count for the demands for the client ID
  const demandCounts = await DemandCount.find({}).lean();
  let requiredCount;
  for (const count of demandCounts) {
    if (count.client.oid.toString() === clientId) {
      console.log(count);
      requiredCount = count;
    }
  }
  if (!requiredCount) {
    res.status(400).json({
      success: false,
      error: 'Invalid client ID',
    });
  }
  let requestId = requiredCount.sequence + 1;
  await DemandCount.findByIdAndUpdate(requiredCount._id.toString(), {
    sequence: requestId,
  });

  let recruitment = new Recruitment({
    demand: {
      $ref: 'demands',
      oid: demandId,
    },
    client: {
      $ref: 'clients',
      oid: clientId,
    },
  });
  recruitment = await recruitment.save();
  // TODO: Update the demand with a new request ID
  await Demand.findByIdAndUpdate(demandId, {
    requestId,
  });

  res.status(200).json({ success: true, message: 'Request ID Updated' });
};

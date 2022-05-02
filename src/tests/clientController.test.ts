import ClientController from '../controllers/clientController';
import { IClient } from '../interface/client.interface';
import { IGroupSummary } from '../interface/group-summary.interface';
import { Client } from '../models/clientModel';

describe('Client Controller Tests:', () => {
  const mockSendStatusResponse = () => {
    const resStatus: any = {};
    resStatus.sendStatus = jest.fn().mockReturnValue(resStatus);
    return resStatus;
  };

  describe('Put', () => {
    Client.prototype.save = jest.fn(() => {});

    const mockRequest: any = {
      params: {
        id: 'e335175a-eace-4a74-b99c-c6466b6afefaqaa3',
        group: 'particle-detector'
      },
      body: {
        foo: 1,
      },
    };
    let result: IClient;
    const mockResponse: any = {
      status: jest.fn(),
      json: jest.fn((x: IClient) => { result = x }),
    };

    it('should add a new client', async () => {
      Client.findOne = jest.fn().mockReturnValueOnce({exec: () => null});

      const now = Date.now();
      const client: IClient = {
        id: mockRequest.params.id,
        group: mockRequest.params.group,
        createdAt: now,
        updatedAt: now,
        meta: mockRequest.body
      }

      await ClientController.put(mockRequest, mockResponse);

      expect(result.id).toBe(client.id);
      expect(result.group).toBe(client.group);
      expect(result.createdAt).toBeGreaterThanOrEqual(client.createdAt);
      expect(result.updatedAt).toBeGreaterThanOrEqual(client.updatedAt);
      expect(result.createdAt).toBe(result.updatedAt);
    })

    it('should update the existing client', async () => {
      const client: IClient = {
        id: mockRequest.params.id,
        group: mockRequest.params.group,
        createdAt: 1571418096158,
        updatedAt: 1571418096158,
        meta: mockRequest.body
      }

      Client.findOne = jest.fn().mockReturnValueOnce({exec: () => new Client(client)});

      await ClientController.put(mockRequest, mockResponse);

      expect(result.id).toBe(client.id);
      expect(result.group).toBe(client.group);
      expect(result.createdAt).toBe(client.createdAt);
      expect(result.updatedAt).toBeGreaterThan(client.updatedAt);
    })

    it('should send status 500', async () => {
      Client.findOne = jest.fn().mockReturnValueOnce({exec: () => { throw new Error(); } });

      const res = mockSendStatusResponse();

      await ClientController.put(mockRequest, res);

      expect(res.sendStatus).toBeCalledWith(500);
    })
  })

  describe('Get Group', () => {
    const mockRequest: any = {
      params: {
        group: 'particle-detector'
      },
    };
    const mockResponse = () => {
      const res: any = {};
      res.status = jest.fn().mockReturnValue(res);
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should return no content', async () => {
      Client.find = jest.fn().mockReturnValueOnce({exec: () => []});

      const res = mockResponse();
      await ClientController.getGroup(mockRequest, res);
      expect(res.status).toBeCalledWith(204);
    })

    it('should return group with 1 client', async () => {
      const client: IClient = {
        id: mockRequest.params.id,
        group: mockRequest.params.group,
        createdAt: 1571418096158,
        updatedAt: 1571418896188,
        meta: mockRequest.body
      }
      const clients = [new Client(client)];
      Client.find = jest.fn().mockReturnValueOnce({exec: () => clients});

      const res = mockResponse();
      await ClientController.getGroup(mockRequest, res);
      expect(res.status).toBeCalledWith(200);
      expect(res.json).toBeCalledWith(clients);
    })

    it('should send status 500', async () => {
      Client.find = jest.fn().mockReturnValueOnce({exec: () => { throw new Error(); } });

      const res = mockSendStatusResponse();
      await ClientController.put(mockRequest, res);

      expect(res.sendStatus).toBeCalledWith(500);
    })
  })

  describe('Get', () => {
    const mockResponse = () => {
      const res: any = {};
      res.json = jest.fn().mockReturnValue(res);
      return res;
    };

    it('should return empty array', async () => {
      Client.aggregate = jest.fn().mockReturnValueOnce({group: () => { return { exec: () => [] }}});

      const res = mockResponse();
      let req: any;
      await ClientController.get(req, res);
      expect(res.json).toBeCalledWith([]);
    })

    it ('should return summary of 2 groups', async () => {
      const groupsSummary: IGroupSummary[] = [
        {
          group: 'particle-detector',
          instances: 2,
          createdAt: 1571418096158,
          lastUpdatedAt: 1571448596169
        },
        {
          group: 'particle-detector1',
          instances: 5,
          createdAt: 1571418045249,
          lastUpdatedAt: 1571419945260
        },
      ]
      Client.aggregate = jest.fn().mockReturnValueOnce({ group: () => { return { exec: () => [
        {
          _id: groupsSummary[0].group,
          instances: groupsSummary[0].instances,
          createdAt: groupsSummary[0].createdAt,
          lastUpdatedAt: groupsSummary[0].lastUpdatedAt
        },
        {
          _id: groupsSummary[1].group,
          instances: groupsSummary[1].instances,
          createdAt: groupsSummary[1].createdAt,
          lastUpdatedAt: groupsSummary[1].lastUpdatedAt
        },
      ]
     }}});

     const res = mockResponse();
     let req: any;
     await ClientController.get(req, res);
     expect(res.json).toBeCalledWith(groupsSummary);
    })

    it('should send status 500', async () => {
      Client.aggregate = jest.fn().mockReturnValueOnce({group: () => { return { exec: () => { throw new Error(); } }}});

      const res = mockSendStatusResponse();
      let req: any;
      await ClientController.put(req, res);

      expect(res.sendStatus).toBeCalledWith(500);
    })
  })

  describe('Delete', () => {
    const mockRequest: any = {
      params: {
        id: 'e335175a-eace-4a74-b99c-c6466b6afefaqaa3',
        group: 'particle-detector'
      }
    };

    it('should delete non existing client', async () => {
      Client.deleteOne = jest.fn().mockReturnValueOnce({exec: () => 0});

      const res = mockSendStatusResponse();
      await ClientController.delete(mockRequest, res);
      expect(res.sendStatus).toBeCalledWith(204);
    })

    it('should delete existing client', async () => {
      Client.deleteOne = jest.fn().mockReturnValueOnce({exec: () => 1});

      const res = mockSendStatusResponse();
      await ClientController.delete(mockRequest, res);
      expect(res.sendStatus).toBeCalledWith(204);
    })

    it('should send status 500', async () => {
      Client.deleteOne = jest.fn().mockReturnValueOnce({exec: () => { throw new Error(); }});

      const res = mockSendStatusResponse();
      await ClientController.delete(mockRequest, res);
      expect(res.sendStatus).toBeCalledWith(500);
    })
  })
})
import ClientController from '../controllers/clientController';
import { IClient } from '../interface/client.interface';
import { Client } from '../models/clientModel';

describe('Client Controller Tests:', () => {
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
  })
})
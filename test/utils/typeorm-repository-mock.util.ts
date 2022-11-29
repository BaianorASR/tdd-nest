export class TypeOrmRepositoryMock {
  public find = jest.fn();
  public findOne = jest.fn();
  public findOneBy = jest.fn();
  public create = jest.fn();
  public save = jest.fn();
  public update = jest.fn();
  public delete = jest.fn();
}

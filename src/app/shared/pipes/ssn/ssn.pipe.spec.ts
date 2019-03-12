import { SsnPipe } from './ssn.pipe';

describe('SsnPipe', () => {
  it('create an instance', () => {
    const pipe = new SsnPipe();
    expect(pipe).toBeTruthy();
  });
});

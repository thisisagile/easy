import React from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { Row } from '../../src';

describe('Row', () => {
  const component = (
    <Row cols={3}>
      <div>A</div>
      <div>B</div>
      <div>C</div>
    </Row>
  );

  test('renders children', async () => {
    const { container } = await rendersWait(component);
    expect(container.innerHTML).toContain('A');
    expect(container.innerHTML).toContain('B');
    expect(container.innerHTML).toContain('C');
  });

  test('sets css variable for equal columns', async () => {
    const { container } = await rendersWait(component);
    expect(container.innerHTML).toContain('repeat(3, 1fr)');
  });

  test('sets css variable for ratio columns', async () => {
    const { container } = await rendersWait(
      <Row cols={[2, 1]}>
        <div>A</div>
        <div>B</div>
      </Row>
    );
    expect(container.innerHTML).toContain('2fr 1fr');
  });

  test('sets tablet and mobile variables from cols when overrides not provided', async () => {
    const { container } = await rendersWait(component);
    expect(container.innerHTML).toContain('--tablet-cols: repeat(3, 1fr)');
    expect(container.innerHTML).toContain('--mobile-cols: repeat(3, 1fr)');
  });

  test('mobileCols falls back to tabletCols when not set', async () => {
    const { container } = await rendersWait(
      <Row cols={4} tabletCols={2}>
        <div>A</div>
        <div>B</div>
      </Row>
    );
    expect(container.innerHTML).toContain('--tablet-cols: repeat(2, 1fr)');
    expect(container.innerHTML).toContain('--mobile-cols: repeat(2, 1fr)');
  });

  test('sets tablet and mobile variables when overrides provided', async () => {
    const { container } = await rendersWait(
      <Row cols={4} tabletCols={2} mobileCols={1}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
        <div>D</div>
      </Row>
    );
    expect(container.innerHTML).toContain('--cols: repeat(4, 1fr)');
    expect(container.innerHTML).toContain('--tablet-cols: repeat(2, 1fr)');
    expect(container.innerHTML).toContain('--mobile-cols: repeat(1, 1fr)');
  });

  test('sets cols override with array and partial mobile override', async () => {
    const { container } = await rendersWait(
      <Row cols={[3, 1]} mobileCols={1}>
        <div>A</div>
        <div>B</div>
      </Row>
    );
    expect(container.innerHTML).toContain('--cols: 3fr 1fr');
    expect(container.innerHTML).toContain('--mobile-cols: repeat(1, 1fr)');
  });

  test('renders without children', async () => {
    const { container } = await rendersWait(<Row cols={3} />);
    expect(container.querySelector('div')).toBeDefined();
  });

  test('applies equalHeight class by default', async () => {
    const { container } = await rendersWait(component);
    expect(container.innerHTML).toContain('equalHeight');
  });

  test('does not apply equalHeight class when false', async () => {
    const { container } = await rendersWait(
      <Row cols={2} equalHeight={false}>
        <div>A</div>
        <div>B</div>
      </Row>
    );
    expect(container.innerHTML).not.toContain('equalHeight');
  });
});

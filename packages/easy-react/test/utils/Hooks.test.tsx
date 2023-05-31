import React, { useEffect } from 'react';
import '@thisisagile/easy-test';
import { rendersWait } from '@thisisagile/easy-test-react';
import { useEntity, useGet, useGetList, useList, usePageList, usePaging, useToggle } from '../../src';
import { Address, resolve, toList, toPageList } from '@thisisagile/easy';

const city = 'Amsterdam';

const ToggleHook = () => {
  const [toggle, setToggle] = useToggle(false);
  const [, setVisible] = useToggle();

  useEffect(() => {
    setToggle();
    setVisible();
  }, []);
  return <div id={'42'}>{`${toggle}`}</div>;
};

const EntityHook = () => {
  const [address, setAddress] = useEntity<Address>();

  useEffect(() => {
    setAddress(new Address({ city }));
  }, []);
  return <>{`${address}`}</>;
};

const GetHook = () => {
  const [address, getAddress] = useGet(() => resolve(new Address({ city })));

  useEffect(() => {
    void getAddress();
  }, []);
  return <>{`${address}`}</>;
};

const ListHook = () => {
  const [list, setList] = useList<Address>();

  useEffect(() => {
    setList(toList<Address>(new Address({ city })));
  }, []);
  return <>{`${list.first()}`}</>;
};

const PageListHook = () => {
  const [list, setList] = usePageList<Address>();

  useEffect(() => {
    setList(toPageList<Address>([new Address({ city })]));
  }, []);
  return <>{`${list.first()}`}</>;
};

const PagingHook = () => {
  const [addresses, next] = usePaging(() => resolve(toPageList([new Address({ city })])));

  useEffect(() => {
    void next();
  }, []);
  return <>{`${addresses.first()}`}</>;
};

const GetListHook = () => {
  const [addresses, getAddresses] = useGetList(() => resolve(toList(new Address({ city }))));

  useEffect(() => {
    void getAddresses();
  }, []);
  return <>{`${addresses.first()}`}</>;
};

describe('Hooks', () => {
  test('component with useToggle hook renders correctly as default value is false.', async () => {
    const { container, byText } = await rendersWait(<ToggleHook />);
    expect(container).toMatchSnapshot();
    expect(byText('true')).toBeDefined();
  });

  test('component with useEntity hook renders correctly.', async () => {
    const { container, byText } = await rendersWait(<EntityHook />);
    expect(container).toMatchSnapshot();
    expect(byText(city)).toBeDefined();
  });

  test('component with useGet hook renders correctly.', async () => {
    const { container, byText } = await rendersWait(<GetHook />);
    expect(container).toMatchSnapshot();
    expect(byText(city)).toBeDefined();
  });

  test('component with useList hook renders correctly.', async () => {
    const { container, byText } = await rendersWait(<ListHook />);
    expect(container).toMatchSnapshot();
    expect(byText(city)).toBeDefined();
  });

  test('component with useGetList hook renders correctly.', async () => {
    const { container, byText } = await rendersWait(<GetListHook />);
    expect(container).toMatchSnapshot();
    expect(byText(city)).toBeDefined();
  });

  test('component with usePageList hook renders correctly.', async () => {
    const { container, byText } = await rendersWait(<PageListHook />);
    expect(container).toMatchSnapshot();
    expect(byText(city)).toBeDefined();
  });

  test('component with usePaging hook renders correctly.', async () => {
    const { container, byText } = await rendersWait(<PagingHook />);
    expect(container).toMatchSnapshot();
    expect(byText(city)).toBeDefined();
  });
});

import { ViewRate } from '../process/ViewRate';
import { useEffect } from 'react';
import { useList } from '../../../src';
import { Currency, log, we } from '@thisisagile/easy';
import { Exchange } from '../domain/Exchange';


export default function ViewDemoView({ uc = new ViewRate() }) {
  const [rates, setRates] = useList<Exchange>();

  useEffect(() => {
    uc.all()
      .then(es => setRates(es))
      .catch(() => log(we.could.not.find.it));
  }, []);

  return (
    <>
      <div>
        <h1>Easy demo page</h1>
        <h2>{`Today's EUR/US exchange rate ${rates.first(r => Currency.USD.equals(r.target)).rate}`}</h2>
      </div>
    </>
  )
}
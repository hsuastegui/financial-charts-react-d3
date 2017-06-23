import Rx from "rxjs/Rx";
import { DOM as RxDOM } from "rx-dom";
import _ from "lodash";

export const dataStream = data => {
  const chunks = _.chunk(data, 9);
  return Rx.Observable.zip(
    Rx.Observable.from(chunks),
    Rx.Observable.timer(0, 2000),
    (item, i) => item
  );
};

export const resizeObserver = RxDOM.resize(window);

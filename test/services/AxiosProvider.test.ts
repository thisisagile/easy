import { AxiosProvider, HttpVerb } from "../../src";
import { DevUri } from "../ref";
import axios from "axios";
import { fits, mock } from "@thisisagile/easy-test";

describe("AxiosProvider", () => {
  const message = "This is not right.";
  let provider: AxiosProvider;

  beforeEach(() => {
    provider = new AxiosProvider();
  });

  test("Simple get", async () => {
    axios.request = mock.resolve({ name: "Sander" });
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(axios.request).toHaveBeenCalledWith(fits.with({
      url: DevUri.Developers.toString(),
      method: HttpVerb.Get.id
    }));
    expect(r.body.data.items).toHaveLength(1);
  });

  test("Get with list", async () => {
    axios.request = mock.resolve([{ name: "Sander" }, { name: "Wouter" }]);
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get });
    expect(r.body.data.items).toHaveLength(2);
  });

  test("Get with transform", async () => {
    axios.request = mock.resolve({ dev: { name: "Sander" } });
    const r = await provider.execute({ uri: DevUri.Developers, verb: HttpVerb.Get, transform: r => r.dev });
    expect(r.body.data.items[0]).toMatchObject({ name: "Sander" });
  });

  test("Get with reject and response", async () => {
    axios.request = mock.reject({ response: { statusText: message } });
    return expect(provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get
    })).rejects.toEqual(expect.objectContaining({ body: { error: expect.objectContaining({ message }) } }));
  });

  test("Get with reject and request", async () => {
    axios.request = mock.reject({ request: { status: 400, statusText: message } });
    return expect(provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get
    })).rejects.toEqual(expect.objectContaining({ body: { error: expect.objectContaining({ message }) } }));
  });

  test("Get with reject and message", async () => {
    axios.request = mock.reject({ message });
    return expect(provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get
    })).rejects.toEqual(expect.objectContaining({ body: { error: expect.objectContaining({ message }) } }));
  });

  test("Get with reject and transform", async () => {
    axios.request = mock.reject({ message });
    return expect(provider.execute({
      uri: DevUri.Developers,
      verb: HttpVerb.Get, transform: r => r.dev
    })).rejects.toEqual(expect.objectContaining({ body: { error: expect.objectContaining({ message }) } }));
  });
});

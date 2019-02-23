import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import Pagination, { PAGINATION_QUERY } from "../components/Pagination";
import { MockedProvider } from "react-apollo/test-utils";
import Router from "next/router";
Router.router = {
  push() {},
  prefetch() {}
};

function makeMocksFor(length) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: "aggregate",
            aggregate: {
              __typename: "count",
              count: length
            }
          }
        }
      }
    }
  ];
}

describe("<Pagination/>", () => {
  it("loading", () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    expect(wrapper.text()).toContain("Loading...");
  });

  it("renders pagination for 18", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find(".totalPages").text()).toEqual("5");
    const pagination = wrapper.find('div[data-test="pagination"]');
    expect(toJSON(pagination)).toMatchSnapshot();
  });
  it("disables prev on first", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(true);
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(false);
  });
  it("disables next on last", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={5} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(true);
  });
  it("disables neither on middle", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(false);
  });
});

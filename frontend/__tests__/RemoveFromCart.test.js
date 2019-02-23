import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { ApolloConsumer } from "react-apollo";
import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION
} from "../components/RemoveFromCart";
import { CURRENT_USER_QUERY } from "../components/User";
import { fakeUser, fakeCartItem } from "../lib/testUtils";

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  },
  {
    request: {
      query: REMOVE_FROM_CART_MUTATION,
      variables: { id: fakeCartItem().id }
    },
    result: {
      data: {
        removeFromCart: {
          __typename: "CartItem",
          id: fakeCartItem().id
        }
      }
    }
  }
];

describe("<RemoveFromCart />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RemoveFromCart id={fakeCartItem().id} />
      </MockedProvider>
    );
    expect(toJSON(wrapper.find("button"))).toMatchSnapshot();
  });

  it("it removes cart item", async () => {
    let apolloClient;
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client;
            return <RemoveFromCart id={fakeCartItem().id} />;
          }}
        </ApolloConsumer>
      </MockedProvider>
    );
    await wait();
    const {
      data: { me }
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(me.cart).toHaveLength(1);
    wrapper.find("button").simulate("click");
    await wait();
    const {
      data: { me: me2 }
    } = await apolloClient.query({ query: CURRENT_USER_QUERY });
    expect(me2.cart).toHaveLength(0);
  });
});

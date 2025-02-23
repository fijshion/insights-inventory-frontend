/* eslint-disable camelcase */
import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import InfrastructureCard from './InfrastructureCard';
import configureStore from 'redux-mock-store';
import { infraTest, rhsmFacts } from '../../../__mocks__/selectors';

const location = {};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => location,
    useHistory: () => ({
        push: () => undefined
    })
}));

describe('InfrastructureCard', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        location.pathname = 'localhost:3000/example/path';
        mockStore = configureStore();
        initialState = {
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...infraTest
                }
            }, entityDetails: {
                entity: {
                    facts: {
                        rhsm: rhsmFacts
                    }
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {}, entityDetails: {} });
        const wrapper = render(<InfrastructureCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const store = mockStore(initialState);
        const wrapper = render(<InfrastructureCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with rhsm facts', () => {
        const store = mockStore({
            ...initialState,
            systemProfileStore: {
                systemProfile: {
                    loaded: true
                }
            }
        });
        const wrapper = render(<InfrastructureCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render enabled/disabled', () => {
        const store = mockStore({
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...infraTest
                }
            }, entityDetails: {
                entity: {}
            }
        });
        const wrapper = render(<InfrastructureCard store={ store } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('api', () => {
        it('should NOT call handleClick', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            const wrapper = mount(<InfrastructureCard store={ store } />);
            wrapper.find('dd a').first().simulate('click');
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should call handleClick on ipv4', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            location.pathname = 'localhost:3000/example/ipv4';
            const wrapper = mount(<InfrastructureCard handleClick={ onClick } store={ store } />);
            wrapper.find('dd a').first().simulate('click');
            expect(onClick).toHaveBeenCalled();
        });

        it('should call handleClick on ipv6', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            location.pathname = 'localhost:3000/example/ipv6';
            const wrapper = mount(<InfrastructureCard handleClick={ onClick } store={ store } />);
            wrapper.find('dd a').at(1).simulate('click');
            expect(onClick).toHaveBeenCalled();
        });

        it('should call handleClick on interfaces', () => {
            const store = mockStore(initialState);
            const onClick = jest.fn();
            location.pathname = 'localhost:3000/example/interfaces';
            const wrapper = mount(<InfrastructureCard handleClick={ onClick } store={ store } />);
            wrapper.find('dd a').at(2).simulate('click');
            expect(onClick).toHaveBeenCalled();
        });
    });

    [
        'hasType',
        'hasVendor',
        'hasIPv4',
        'hasIPv6',
        'hasInterfaces'
    ].map((item) => it(`should not render ${item}`, () => {
        const store = mockStore(initialState);
        const wrapper = render(<InfrastructureCard store={ store } {...{ [item]: false }} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    }));

    it('should render extra', () => {
        const store = mockStore(initialState);
        const wrapper = render(<InfrastructureCard store={ store } extra={[
            { title: 'something', value: 'test' },
            { title: 'with click', value: '1 tests', onClick: (_e, handleClick) => handleClick('Something', {}, 'small') }
        ]} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

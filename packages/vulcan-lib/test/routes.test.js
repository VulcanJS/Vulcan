import expect from 'expect'
import { addRoute, populateRoutesApp, emptyRoutes, Routes } from '../lib/modules/routes'
const Foo = () => 'foo'
describe('vulcan:lib/routes', () => {
    beforeEach(() => {
        emptyRoutes()
    })
    it('add and retrieve a route', () => {
        const route = {
            name: 'foo',
            path: '/coo',
            component: Foo
        }
        addRoute(route)
        populateRoutesApp()
        expect(Routes['foo']).toEqual(route)
    })
    it('takes parent name into consideration', () => {
        const parentRoute = {
            name: 'parent',
            path: '/parent',
            component: Foo
        }
        const route = {
            name: 'foo',
            path: '/foo',
            component: Foo
        }
        addRoute(parentRoute)
        addRoute(route, 'parent')
        populateRoutesApp()
        expect(Routes['parent'].childRoutes).toEqual([route])
    })
    it('add array of routes', () => {
        const route1 = {
            name: 'foo1',
            path: '/foo1',
            component: Foo
        }
        const route2 = {
            name: 'foo2',
            path: '/foo2',
            component: Foo
        }
        const routes = [route1, route2]
        addRoute(routes)
        populateRoutesApp()
        expect(Routes['foo1']).toEqual(route1)
        expect(Routes['foo2']).toEqual(route2)
    })
})
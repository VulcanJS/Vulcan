import React, { PropTypes, Component } from 'react';
import gql from 'graphql-tag';
import withList from './withList';

export default function withReactiveList (options) {
    return function reactiveListEnhancer(WrappedComponent){
        return withList(options)(class ReactiveList extends Component{
        constructor(props){
            super(props);
            this.subscription = null;
        }
        componentWillReceiveProps(nextProps) {
            console.log(nextProps);

            if (!nextProps.loading) {
                let ids=[], nextIds=[];
                if(this.props.results){
                    ids = this.props.results.map((res)=>res._id)
                }
                if(nextProps.results){
                    nextIds = nextProps.results.map((res)=>res._id)
                }
                
                if (this.subscription && nextIds.reduce((a,i,index)=>a?a:i!==ids[index],false)) {
                    // Stop subscription
                    this.subscription();
                    this.subscription = null;
                }
                if (!this.subscription) {
                    this.subscribe(nextIds, nextProps.fragment, nextProps.fragmentName);
                }
            }
        }
        subscribe = (ids, fragment, fragmentName) => {
            const subscriptionName = options.subscriptionName || `${options.collection.options.collectionName}Subscription`;
            const subscription = gql`
                subscription ${subscriptionName}($ids:[String!]){
                    ${options.subscriptionName || options.collection.options.collectionName}(filter:{node:{_id_in:$ids}}){
                        mutation
                        node{
                            __typename
                            ...${fragmentName}
                        }
                    }
                }
                ${fragment}
            `
            this.subscription = this.props.subscribeToMore({
                document: subscription,
                variables: { ids },
                updateQuery:(...args)=>{
                    console.log(args)
                }
            });
        }
        componentWillUnmount() {
            if (this.subscription) {
                this.subscription();
            }
        }
        render(){
            console.log(this)
            return <WrappedComponent {...this.props}/>
        }
    })}
}
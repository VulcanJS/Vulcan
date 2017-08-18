import React, { PropTypes, Component } from 'react';
import gql from 'graphql-tag';
import withDocument from './withDocument';

export default function withReactiveDocument (options) {
    return function reactiveDocumentEnhancer(WrappedComponent){
        return withDocument(options)(class ReactiveDocument extends Component{
        constructor(props){
            super(props);
            this.subscription = null;
        }
        componentWillReceiveProps(nextProps) {
            if (!nextProps.loading) {
                if (this.subscription && this.props.documentId !== nextProps.documentId) {
                    // Stop subscription
                    this.subscription();
                    this.subscription = null;
                }
                if (!this.subscription) {
                    this.subscribe(nextProps.documentId, nextProps.fragment, nextProps.fragmentName);
                }
            }
        }
        subscribe = (id, fragment, fragmentName) => {
            const subscriptionName = options.subscriptionName || `${options.collection.options.collectionName}Subscription`;
            const subscription = gql`
                subscription ${subscriptionName}($id:String){
                    ${options.subscriptionName || options.collection.options.collectionName}(filter:{node:{_id:$id}}){
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
                variables: { id }
            });
        }
        componentWillUnmount() {
            if (this.subscription) {
                this.subscription();
            }
        }
        render(){
            return <WrappedComponent {...this.props}/>
        }
    })}
}
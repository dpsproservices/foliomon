import React, { useEffect } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import WizardButton from './WizardButton';

const Wizard = (props) => {

    const { children, initialValues, onSubmit, decorators, subscription, allowPrevious, allowNext } = props;

    const [page, setPage] = useState(0); // page array index 0 to Number of Pages - 1
    const [values, setValues] = useState( initialValues || {} );
    const [activePage, setActivePage] = useState(React.Children.toArray(children)[page]);
    const [isLastPage, setIsLastPage] = useState(page === React.Children.count(children) - 1);
    const [canGoPrevious, setCanGoPrevious] = useState(allowPrevious);
    const [canGoNext, setCanGoNext] = useState(allowNext);

    const setNextPage = (values) => {
        //setPage(Math.min(page + 1, children.length - 1) + 1);
        setPage(page + 1);
        setValues(values);
    };

    const setPreviousPage = () => {
        //setPage(Math.max(page - 1, 0));
        setPage(page - 1);
    };

    useEffect(() => {
        setActivePage(React.Children.toArray(children)[page]);
        setIsLastPage(page === React.Children.count(children) - 1);
    }, [children,page]); 

    /**
     * NOTE: Both validate and handleSubmit switching are implemented
     * here because Redux Final Form does not accept changes to those
     * functions once the form has been defined.
     */

    const validate = (values) => {
        //const activePage = React.Children.toArray(props.children)[page];
        return activePage.props.validate ? activePage.props.validate(values) : {};
    };

    const handleSubmit = (values) => {
        //const { children, onSubmit } = props;
        //const isLastPage = (page === React.Children.count(children) - 1);
        
        if (isLastPage) {
            return onSubmit(values);
        } else {
            setNextPage(values);
        }
    };
    
    return (
        <Form
            initialValues={values}
            validate={validate}
            onSubmit={handleSubmit}
            decorators={decorators}
            subscription={subscription}
            render={
                ({ handleSubmit, form, submitting, pristine, values }) => (
                <form noValidate={true} autoComplete="off" onSubmit={handleSubmit}>

                    {activePage}

                    <WizardButton 
                        page={page} 
                        isLastPage={isLastPage}
                        submitting={submitting} 
                        setPreviousPage={setPreviousPage}
                        canGoPrevious={canGoPrevious} 
                        canGoNext={canGoNext}
                    />

                    {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
                </form>
            )}
        />
    );
};

Wizard.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

Wizard.Page = ({ children }) => children;

export default Wizard;
// import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import { ActionList, ActionListGroup, ActionListItem, Button, Content, Form, FormGroup } from "@patternfly/react-core";

export default function Terms(props: PageProps<Extract<KcContext, { pageId: "terms.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    // const { kcClsx } = getKcClsx({
    //     doUseDefaultCss,
    //     classes
    // });

    const { msg, msgStr } = i18n;

    const { url } = kcContext;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("termsTitle")}
        >
            <Content id="kc-terms-text">
                <p>To continue, you must review and accept the latest version of the <a href="https://tangledwires.co.uk/legal/account-terms" target="_blank">TangledWires Account Terms of Service</a> and the <a href="https://tangledwires.co.uk/legal/account-privacy" target="_blank">TangledWires Account Privacy Policy</a>.</p>
                <p>If you are between 13 and 18 years old, your parent or legal guardian must review and agree to these terms with you.</p>
            </Content>
            <Form action={url.loginAction} method="POST">
                <FormGroup isActionGroup>
                    <ActionList>
                        <ActionListGroup>
                            <ActionListItem>
                                <Button
                                    name="accept"
                                    id="kc-accept"
                                    type="submit"
                                >
                                    {msgStr("doAccept")}
                                </Button>
                            </ActionListItem>
                            <ActionListItem>
                                <Button
                                    name="cancel"
                                    id="kc-decline"
                                    type="submit"
                                >
                                    {msgStr("doDecline")}
                                </Button>
                            </ActionListItem>
                        </ActionListGroup>
                    </ActionList>
                </FormGroup>
            </Form>
            <div className="clearfix" />
        </Template>
    );
}

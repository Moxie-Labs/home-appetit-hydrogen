import { Suspense } from "react";
import { AccountModal } from "../components/AccountModal.client";
import GuestSignupModal from "../components/GuestSignupModal.client";
import { Layout } from "../components/Layout.client";
import { LayoutSection } from "../components/LayoutSection.client";
import { Page } from "../components/Page.client";

export default function SignUp() {
  
    return (
        <>
            <Suspense>
                <Layout>
                    <AccountModal/>    
                    <GuestSignupModal/>    
                </Layout>
            </Suspense>
        </>
    );
}
"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { listOrganisations } from "@/actions/orgs/list";
import { useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading";
import { Strong, Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import Image from "next/image";
import RequireSignIn from "@/components/RequireSignIn";
import { toast } from "sonner";
import { useAuth } from "../providers";

export default function BulkTransferRepositories() {
	const { token } = useAuth();

	const isSignedIn = token && token.length > 0;

	return (
		<div className="flex flex-col justify-center h-full">
			<PageHeading
				title="Bulk Transfer Repositories"
				description="Move your repositories in bulk between organizations and personal accounts."
			/>
			<Text>
				Select the organization you want to transfer repositories{" "}
				<Strong>from</Strong>.
			</Text>
			<Divider className="my-6" />
			{isSignedIn ? <OrganizationsList /> : <RequireSignIn />}
		</div>
	);
}

function OrganizationsList() {
	const { token } = useAuth();
	const [orgs, setOrgs] = useState<any[] | null>(null);

	useEffect(() => {
		async function getListOfOrganizations() {
			const response = await listOrganisations({
				token: token ?? "",
			});
			if (response.token_expired === true) {
				toast.error("Session expired. Please sign in again.");
				return;
			}

			if (response.is_error === true) {
				console.error(response.error);
				toast.error(
					response?.error ?? "Failed to fetch organizations. Please try again.",
				);
			} else {
				setOrgs(response.data);
			}
		}

		getListOfOrganizations();
	}, [token]);

	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader>ID</TableHeader>
					<TableHeader>Avatar</TableHeader>
					<TableHeader>Name</TableHeader>
				</TableRow>
			</TableHead>
			<TableBody>
				{orgs ? (
					orgs?.map((org) => (
						<TableRow key={org.handle} href={`/transfer/${org.handle}`}>
							<TableCell className="font-medium">{org.id}</TableCell>
							<TableCell>
								<Image
									src={org.avatar}
									alt={org.handle}
									className="size-8 rounded-full"
									unoptimized
									width={32}
									height={32}
								/>
							</TableCell>
							<TableCell>
								<Text>{org.handle}</Text>
							</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={3} className="text-center">
							No GitHub Accounts found.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}

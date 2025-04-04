import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserCompanyRelation1743775164821 implements MigrationInterface {
    name = 'AddUserCompanyRelation1743775164821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6dcdcbb7d72f64602307ec4ab3\` ON \`companies\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` DROP FOREIGN KEY \`FK_6dcdcbb7d72f64602307ec4ab39\``);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`ownerId\` \`ownerId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`companies\` ADD CONSTRAINT \`FK_6dcdcbb7d72f64602307ec4ab39\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`companies\` DROP FOREIGN KEY \`FK_6dcdcbb7d72f64602307ec4ab39\``);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`ownerId\` \`ownerId\` int NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`companies\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`companies\` ADD CONSTRAINT \`FK_6dcdcbb7d72f64602307ec4ab39\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refreshToken\` \`refreshToken\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_6dcdcbb7d72f64602307ec4ab3\` ON \`companies\` (\`ownerId\`)`);
    }

}
